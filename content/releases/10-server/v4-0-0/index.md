---
title: v4.0.0
description: The massively upgraded deepstream server! Introducing too many changes to be contained within a description!
---

### Features:

- New protobuf protocol support (under the hood)
- Bulk actions instead of individual subscribes (under the hood)
- Official Plugin Support
- Monitoring Support
- Clustering Support (with small caveats)
- Listening Discovery Simplification
- V2 storage API
- V2 cache API
- Notify API

### Improvements

- Lazy data parsing
- Improved deepstream lifecycle
- Upgraded development tools
- New deepstream.io website

### Backwards compatibility

- All V3 SDKs no longer compatible due to protobuf binary protocol

### Upgrade guide

You can see the upgrade guide for backwards compatibility [here](/tutorials/upgrade-guides/v4/server/)

## TLDR:

## Unsupported SDKs

I wanted to leave this part till the end, but it's the biggest loss with upgrading to V4 and will be an instant blocker for some users.

We are sad to say that we haven't yet migrated the V3 non browser and node SDKs to V4. The reason is that underlying protocol has changed and the way SDKs were written in V3 constructed and parsed string messages all over the code base. This design has unfortunately meant that while we could write a binary to text parser in the Java SDK it would just make it maintenance hell.

Our Swift SDK has been ambitious from the start, using J2OBJC in order to convert the java code to Objective C with thick polyfills for java methods. While this approach has generally worked, it is really hard to maintain and build.

Our goal going forward is to write a single Kotlin SDK that can run on both iOS and Java. We would also have it run a much more minimal set of functionality, allowing the SDK to only consume strings rather than objects. This would allow us to integrate easily with many of the different flavours of JSON libraries out there.

Because we used Protobuf, however, the good news is we can easily create protocol objects using a generator, which means we can immediately focus on SDKs and less
so on lower level binary parsing!

## This website

There has been a lot of feedback on the differences between our deepstreamHub and deepstream documentation and offerings, where some users were not certain where the line was drawn between open source and enterprise. We also have over a hundred pages of documentation in a world where some of yesterday's hot trends (For example Knockout, AngularJS) have been replaced by others (React, Vue). And even within the one library, approaches have been deprecated, replaced or advised against (React mixins, stateful components, and hooks). While we love keeping up to date with all the latest chatter in DevOps and developer land, it's pretty much impossible to do so while also focusing on integrating important features into deepstream's core. As such, I'm happy to say we have migrated all of our OS documentation and website back to opensource using the amazing [Gatsby]() framework. Every page can now be edited by the community, and adding pages is as easy as writing a markdown document, adding some images and letting the build take care of the rest. If you would like to do anything fancy, you are more than welcome to add a React component! It's worth noting that while all content has been migrated across the css can and will still need an insane amount of ❤️ since that was ported and not rewritten from the original website.

`markdown:release-4.0-protobuf-protocol.md`

## Typescript

We converted the majority of the codebase to typescript, for the benefit of future code maintenance as well making it easier for people to contribute.

This also means that we now have declarations for all possible plugin interfaces which should make it much easier for people to write their own, once they fork the V4 plugin template.

Current custom external plugins are:

- Authentication
- Permissioning
- Storage and Cache
- Logger
- Connection Endpoints
- State Registry Factory
- Subscription Registry Factory
- Monitoring
- Generic Plugins

All these plugins need to extend or implement the same plugin interface (via the @deepstream/types package)

```
abstract class DeepstreamPlugin<PluginConfig> {
  public abstract description: string
  constructor (pluginConfig: PluginConfig, services: DeepstreamServices, config: DeepstreamConfig)
  public init? (): void
  public async whenReady (): Promise<void> {}
  public async close (): Promise<void> {}
  public setConnectionListener (connectionListener: ConnectionListener): void
}
```

Improvements to the startup lifecyle also means that deepstream now launches everything in the following order:

1) Logger
2) Services
3) Handlers
4) Plugins
5) Connection Endpoints

This means by the time your custom plugins are initialized, Deepstream has all the services started. The reason why this isn't the last lifecyle before running is because once the server is stopped you would usually want to drain all the connections before stopping your own custom logic. If you need to access the connection-endpoint directly please raise an issue: it's easy to add a hook, however, simpler APIs are always better.

## Monitoring

A simple monitoring interface was added to monitor statistics from deepstream:

```
interface DeepstreamMonitoring  {
  onErrorLog (loglevel: LOG_LEVEL, event: EVENT, logMessage: string): void
  onLogin (allowed: boolean, endpointType: string): void
  onMessageRecieved (message: Message): void
  onMessageSend (message: Message): void
  onBroadcast (message: Message, count: number): void
}
```

Remember that these hooks are callbacks used to recieve live updates from deepstream internals. If you want to 
query deepstream for more verbose stats you can easily access those from `deepstream services`.

For example, getting all the events subscribed to via a HTTP endpoint would be:

```
class HTTPMonitoringEndpoint extends DeepstreamPlugin implements Monitoring {
    // setup HTTP server and implement interface

    public async whenReady () {
        if (!this.isReady) {
            await new Promise(resolve => this.server.on('ready', resolve))
        }
    }

    private addHTTPEndpoints () {
        this.server.
            get('/events', (req, res) => {
                const eventsSubscribedTo = this.services.getSubscriptionsRegistry(TOPIC.EVENT).getNames()
                res.json(eventsSubscribedTo)
            })
        }
    }
}
```

Further endpoints can be exposed if a usecase is proposed via a feature request.

## Clustering

Clustering is a touchy topic. Up to version three we had it in opensource, but given that we needed to understand our market fit and generate an actual income we took it out of V3 and added in HTTP support instead. I'm very happy to announce that although (here's the caveat) you need to write your own message bus, we have included all the logic for actual clustering in the OS version and got over 100 complex end to end tests running with it.

So how does it work?

Using the following plugins:

- Cluster node

A cluster node is the core of clustering and is responsible for serializing the messages to send, as well as subscribing to any messages in the cluster it may be interested in. The default supplied version with deepstream is a vertical message bus for use with node clustering. It's very easy to write your own though!

```
interface DeepstreamClusterNode  {
  // Broadcast a message to all nodes
  send (message: Message): void
  // Send a message directly to one node. When using PUB/SUB this is simply adding a `toServer` property on the payload
  sendDirect (serverName: string, message: Message): void
  // Subscribe to messages on the event bus
  subscribe<SpecificMessage> (stateRegistryTopic: TOPIC | STATE_REGISTRY_TOPIC, callback: (message: SpecificMessage, originServerName: string) => void): void
}
```

- Locks

A lock registry allows a single node (the cluster leader) to get or release a node. This is currently implemented via a distributed central cluster nominated leader. But if you wanted to you could use a redis cache as easily and get rid of the extra step of having a leader hold onto locks!

```
type LockCallback = (locked: boolean) => void
interface DeepstreamLockRegistry  {
  // Request a lock that is across the entire cluster
  get (lock: string, callback: LockCallback): void
  // Release the lock
  release (lock: string): void
}
```

- State Registries Factory

The state registry is responsible for holding the state of subscriptions across the cluster. The default implementation is distributed, using add/remove and reconciliation checks. However, this is one of the more expensive operations in deepstream due to consistency checks. By being a plugin we could also use a Redis based approach, as long as we figure out how to clear down the state if a server died ungracefully.

```
type StateRegistryCallback = (name: string) => void
interface StateRegistry {
  // The name is registered somewhere on the cluster
  has (name: string): boolean
  // Add the name, called multiple times (so you can figure out how many subscriptions exist on one node)
  add (name: string): void
  // Remove the name, called multiple times
  remove (name: string): void

  // Callback to whenever a name is added (only on first add)
  onAdd (callback: StateRegistryCallback): void
  // Callback to whenever a name is removed (only on last remove)
  onRemove (callback: StateRegistryCallback): void

  // Return all the names (in total or scoped to a server)
  getAll (serverName?: string): string[]
  // Return all the servers who have the name
  getAllServers (subscriptionName: string): string[]
  // Called when a server is removed from cluster for general cleanup
  removeAll (serverName: string): void
}

interface StateRegistryFactory extends DeepstreamPlugin {
  // Factory function
  getStateRegistry (topic: TOPIC | STATE_REGISTRY_TOPIC): StateRegistry
}
```

- Cluster Registry

The cluster registry is simply a registry to maintain the current state of the cluster and figure out who the leader is.

```
interface ClusterRegistry {
  // Is this node the leader?
  isLeader (): boolean
  // What is the server name of the leader?
  getLeader (): string
  // Get the names of all servers in the cluster
  getAll (): string[]
}
```

## Performance Improvements

Things have changed quite a bit in the NodeJS world. [Node 10]() came out with the inclusion of a [new garbage collector](), async/await has changed the coding landscape, and V8 has been optimized for all the ES6 improvements. However, there's unfortunately a bit of a dark side to all of this. In order to improve performance for the ES6 features most developers now use, the actual performance of ES5 has taken a hit. While there were talks about potentially switching to a totally different language instead a total rewrite would have been absolutely impossible. So instead we targeted what I like to call optimistic optimizations, which mean in the worst-case scenario it won't make any difference at all, but if you're lucky you could get boosts of multiple factors.

So what falls under these optimizations?

In this current release there are three parts:

### Lazy data parsing

So the downside behind using JSON as a data payload is that its not exactly fast. Without knowing your schema upfront and given that each record, event or request/response can literally contain anything, there's little we can do currently to improve that. So what we do instead is to just ignore the whole parsing aspect altogether on the server unless needed. What this means is as far as deepstream is concerned, as long as you don't need to access the data you'll never actually parse it. There are three places where the data payload is actually required.

1) Permissions, only if you access the `data` value.

2) Record patches. A record patch (setting a value with a path) has to apply the patch onto the current value requiring both the previous and value to be parsed (bandwidth vs CPU usage tradeoff).

3) Storage adaptors. This is unfortunately unavoidable currently as some storage adaptors don't accept buffers or strings directly. This means even though we pass the data all the way to the storage SDK optimally we have to parse it just for the SDK to serialize it again =(. On that topic as well node hasn't made it too easy with most libraries using the Buffer wrapper while ignoring the more optimal (and not so nice to use) Array Buffer. We are looking at extending our storage API's going forward to allow deepstream to pick between a buffer and string argument to allow optimal paths when possible.

### Seperation of data storage concerns

This one has been a bit of an interesting decision from day one. We initially in V1 had data stored in records with the following nesting:

```json
{
    _v: 1,
    _d: { "status": "DONE" }
}
```

That just made searching an absolute pain, so what we done is transformed the data to instead store it as follows:

```json
{
    __ds: {
        _v: 1
    },
    "status": "DONE"
}
```

The reason it's an object instead is in case we ever decided to add more metadata going forward. The issue with this, however, is we needed to load the entire record into memory and transform it whenever we want to do anything. When you start thinking in bulk (hundreds or thousands of subscriptions) the objects, CPU cycles, and immediate gc this uses is just, well, useless.

So how did we decide on optimizing this? By no longer doing any of the transform logic in the core server. This means rather than deepstream calling into storage using this:

```js
public set (
    name: string, 
    data: { __ds: { _v: number }, ...recordData }, 
    (error: string) => void
)
```

We do this:

```js
public set (
    name: string, 
    version: number,
    data: RecordData, 
    (error: string) => {}
)
```

It looks like a tiny change and for all our current adaptors it's fully backwards compatible. However the goal is for us to start using things like custom Redis commands to store these entries seperately in the cache:

|Name|Example value|Description|
|---|---|---|
|recordName_version|5|The record version|
|recordName_data|{ "name": "Purist" }|The data untouched by deepstream|

This allows us to then do awesome things going forward like:

- Validating the the version number doesn't conflict with the one in the cache rather than in the server, critical when clustering
- Only requesting the version number of records instead of the entire data-set when using offline-storage or doing a head/has
- Potentially storing deepstream data in a meta collection for clear seperation

### Bulk Subscription APIs

This was probably one of the biggest under the hood improvements, and although it can still be seriously optimized going forward it has already shown a huge performance boost.

So whats the difference?

In V3 if you've subscribed to a few thousand records the only optimization that would occur is that it would be sent as an individual websocket frame. So something like this (excuse the repetitiveness):

Sends:

|Topic|Action|Name|
|---|---|---|
|RECORD|SUBSCRIBE|record1|
|RECORD|SUBSCRIBE|record2|
|RECORD|SUBSCRIBE|record3|

And would have recieved the following responses:

Recieves:

|Topic|Action|Name|
|---|---|---|
|RECORD|SUBSCRIBE_ACK|record1|
|RECORD|SUBSCRIBE_ACK|record2|
|RECORD|SUBSCRIBE_ACK|record3|

Where now instead what would happen is:

Recieves:

|Topic|Action|Names|isAck|CorrelationId|
|---|---|---|
|RECORD|SUBSCRIBE[record1, record2, record3]|false|12345|

Sends:
 
|Topic|Action|isAck|CorrelationId|
|---|---|---|
|RECORD|SUBSCRIBE|true|12345|

This gives deepstream a massive boost in performance as it doesn't have to care about individual records. However in terms of permissions it still calls into the permission handler to run them on a per name basis to ensure the same level of granualirity.

### Bulk Head APIs

The new cache now implements `headBulk` which is an insanely quicker way to do bulk hydration when a client reconnects or loads from offline.

The idea being rathern than doing multiple calls to a cache, getting the response, parsing out the version and sending those one by one to the client we now just do it one go.

```
export type StorageHeadBulkCallback = (error: string | null, versions?: { [index: string]: number }, missing?: string[]) => void
public headBulk (names: string[], callback: StorageHeadBulkCallback)
```

The reason why we have a `missing` argument in the response is because we aren't guaranteed that everything we requested is in the cache. If thats the case then it will load the missing records from storage using the classic recordRequest approach and send those lazily as they are loaded.

### Notify API

Deepstream is used in multiple different ways and scenarios. Some users have played with it on their IoT devices, combining HTTP output from sensors and WebSocket connections for interactive realtime dashboards. Others have used it for communication applications and gaming. However, one thing was pretty much always a given, integrating deepstream for records into an existing app, especially one that is crud/HTTP based was a pain. Your application would
update your data via your current trusted/battle-tested approach, and you just want deepstream to consume those changes. Prior to this, you would need to set the data using `setData` APIs. Not any more! As long your database is deepstream compatible (and if not, you can always write a thin StoragePlugin to conform to your standards!) then all you need to do is notify deepstream something changed in the database.

Lets see code!

Previously:

```ts
// Pseduo DB API
await this.db.save(name, value)
await this.ds.record.setDataWithAck(name, value)
```

```ts
// Now
await this.db.save(name, value)
await httpPost('/', {
    topic: 'record',
    action: 'notify',
    names: [name]
})
```

Okay so this doesn't look more performant does it 😅

Lets dive a tiny bit into what happens on the first.

```ts
await this.ds.record.setDataWithAck(name, value)
```

This will do the following on deepstream:
    1) Permission the record on deepstream
    2) Load the data from cache to increment version, if it doesn't exist get from DB
    3) Set the data in database and cache
    4) Respond with a successful write
    5) Notify all interested users
    6) Send to other nodes in cluster to notify their users

That is done for every single update. So if you're updating a thousand records that's 6000 steps. So if you're writing things really quickly it will get quite busy quite fast. Previously we optimized this by having config-options (still supported) like `hotPathPrefixes` which skips the second step.

Now with 

```
await httpPost('/', {
    topic: 'record',
    action: 'notify',
    names: [... 100 thousand names ...]
})
```

This will do the following on deepstream:
    1) Check if the user can use notify, which is a blanket yes or no permission (god mode)
    2) Delete the data from cache using a bulkAPI
    3) Check for all active subscriptions, retrieve data from storage and set in cache (repeated)
    4) Send to other nodes in cluster to notify their users

All steps other than 3 are run once, and the data is only loaded from storage if a user on that deepstream node is interested. This means that we can go down from time in minutes to milliseconds in order to get thousands of updated across!

## Changing development tools

In order to be consistent with all our other repos we have focused on minimizing the amount of variations between toolsets. As such we now have a consistent toolset of mocha, sinon and typescript for our V4 development environments. All adaptors also now use docker to run their tests, as it really simplifies testing and development for all the seperate variations.
