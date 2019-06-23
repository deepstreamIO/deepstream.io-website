---
title: v4.0.0 - Server
description: The massively upgraded deepstream server! Introducing too many changes to be contained within a description!
---

### Features:

- New binary protocol support (under the hood)
- Bulk actions support (under the hood)
- V2 storage API 

```typescript
type StorageReadCallback = (error: string | null, version: number, result: any) => void
type StorageWriteCallback = (error: string | null) => void

interface StoragePlugin extends DeepstreamPlugin {
  apiVersion?: number
  set (recordName: string, version: number, data: any, callback: StorageWriteCallback, metaData?: any): void
  get (recordName: string, callback: StorageReadCallback, metaData?: any): void
  delete (recordName: string, callback: StorageWriteCallback, metaData?: any): void
}
```

### Improvements

- Lazy data parsing
- Upgraded development tools
- New deepstream.io website

### Backwards compatability

- All V3 SDKs no longer compatible due to binary protocol

## TLDR:

## Unsupported SDKs

I wanted to leave this part till the end, but it's the biggest loss with upgrading to V4 and will be an instant blocker for some users.

We are sad to say that we haven't yet migrated the V3 non browser and node SDKs to V4. The reason is because the underlying protocol has changed and the way SDKs were written in V3 and pretty much constructed and parsed messages all over the code base. This design has unfortunately meant that while we could write a binary to text parser in the Java SDK it would just make it maintenance hell.

Our Swift SDK has been ambitious from the start, using J2OBJC in order to convert the java code to Objective C with thick polyfills for java methods. While this approach has worked its really hard to maintain and build.

Our goal going forward is to write a single Kotlin SDK that can run on both iOS and Java. We would also have it run a much more minimal set of functionality, allowing the SDK to only consume strings rather than objects. This would allow us to integrate easily with many of the different flavours of JSON libraries out there.

## This website

There has been alot of feedback on the differences between our deepstreamHub and deepstream documentation and offerings, where some users were not certain where the line was drawn between open source and enterprise. We also have over a hundred pages of documentation in a world where some of yesterday's hot trends (For example knockout, angularJS) have been replaced by others (React, Vue). And even within the one library approaches have been deprecated, replaced or advised against (React mixins, stateful components and hooks). While we love keeping up to date with all the latests chatter in devops and developer land, it's pretty much impossible to do so while also focusing on integrating important features into deepstreams core. As such I'm happy to say we have migrated all of our OS documentation and website back to opensource using the amazing Gatsby framework. Every page can now be edited by the community, and adding pages is as easy as writing a markdown document, adding some images and letting the build take care of the rest. If you would like to do anything fancy your more than welcome to add a React component!

`markdown:release-4.0-binary-protocol.md`

## Typescript

We converted the majority of the codebase to typescript, for the benefit of future code maintenance as well making it easier for people to contribute.

This also means we now had declerations for all the possible plugin interfaces which should make it much easier for people to write their own once they fork the V4 connector template.

Current custom external connectors are:

- Authentication
- Permissioning
- Storage and Cache
- Logger
- Connection Endpoints
- Generic Plugins

## Performance Improvements

Things have changed quite a bit in the nodeJS world. [Node 10]() came out with the inclusion of a [new garabage collector](), async/await has changed the coding landscape and V8 has been optimised for all the ES6 improvements. However there's unforuntately a bit of a dark side to all of this. In order to improve performance for the ES6 features most developers now use, the actual performance of ES5 has taken a hit. While there were talks about potentially switching to a totally different language instead a total rewrite would have been absolutely impossible. So instead we targeted what I like to call optimistic optimizations, which mean in the worse case scenario it won't make any difference at all, but if your lucky you could get boosts of multiple factors.

So what falls under these optimizations?

In this current release there are three parts:

### Lazy data parsing

So the downside behind using JSON as a data payload is that its not exactly fast. Without knowing your schema upfront and given that each record, event or request/response can literally contain anything there's little we can do currently to improve that. So what we do instead is just ignore the whole parsing aspect altogether on the server unless needed. What this means is as far as deepstream is concerned, as long as you don't need to access the data you'll never actually parse it. There are three places where the data payload is actually required.

1) Permissions, only if you access the `data` value.

2) Record patches. A record patch (setting a value with a path) has to apply the patch onto the current value requiring both the previous and value to be parsed (bandwidth vs CPU usage tradeoff).

3) Storage adaptors. This is unfortunately unavoidable currently as some storage adaptors don't accept buffers or strings directly. This means even though we pass the data all the way to the storage SDK optimially we have to parse it just for the SDK to serialize it again =(. On that topic as well node hasn't made it too easy with most libraries using the Buffer wrapper while ignoring the more optimial (and not so nice to use) Array Buffer. We are looking at extending our storage API's going forward to allow deepstream to pick between a buffer and object argument to allow optimal paths when possible.

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

Reason it's an object instead is incase we ever decided to add more meta data going forward. The issue with this however is we needed to load the entire record into memory and transform it whenever want to do anything. When you start thinking in bulk (hundreds or thousands of subscriptions) the objects, CPU cycles and immediate gc this uses is just, well, useless.

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

It looks like a tiny change and for all our current adaptors it's fully backwards compatible. However the goal is for us to start using things like custom redis commands to store these entries seperately in the cache:

|Name|Example value|Description|
|---|---|---|
|recordName_version|5|The record version|
|recordName_data|{ "name": "Purist" }|The data untouched by deepstream|

This allows us to then do awesome things going forward like:

- Validating the version number doesn't conflict on the cache rather than in the server, critical when clustering
- Only requesting the version number of records instead of the entire data-set when using offline-storage or doing a head/has
- Potentially storing deepstream data in a meta collection for clear seperation

### Bulk APIs

This was probably one of the biggest under the hood improvements, and although it can still be seriously optimized going forward it has already shown a huge performance boost.

So whats the difference?

In V3 if you subscribed to a few thousand records the only optimization that would occur is that it would be send as an individual websocket frame. So something like this (excuse the repetitiveness):

Recieves:

|Topic|Action|Name|
|---|---|---|
|RECORD|SUBSCRIBE|record1|
|RECORD|SUBSCRIBE|record2|
|RECORD|SUBSCRIBE|record3|

And would have recieved the following responses:

Sends:

|Topic|Action|Name|
|---|---|---|
|RECORD|SUBSCRIBE_ACK|record1|
|RECORD|SUBSCRIBE_ACK|record2|
|RECORD|SUBSCRIBE_ACK|record3|

Where now instead what would happen is:

Recieves:

|Topic|Action|Name|CorrelationId|
|---|---|---|
|RECORD|SUBSCRIBE_BULK|[record1, record2, record3]|12345|

Sends:
 
|Topic|Action|CorrelationId|
|---|---|---|
|RECORD|SUBSCRIBE_BULK_ACK|12345|

This gives deepstream a massive boost in performance as it doesn't have to care about individual records. However in terms of permissions it still calls into the permission handler to run them on a per name basis to ensure the same level of granualirity.

## Changing development tools

In order to be consistent with all our other repos we have focused on minimizing the amount of variations between toolsets. As such we now have a consistent toolset of mocha, sinon and typescript for our V4 development environments. All adaptors also now use docker to run their tests, as it really simplifies testing and development for all the seperate variations.
