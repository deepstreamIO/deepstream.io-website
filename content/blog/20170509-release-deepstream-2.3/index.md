---
title: "Release: Deepstream 2.3"
description: Announcing the 2.3 release of deepstream.io and all the associated goodies
---
We are super excited to announce the release of [deepstream.io 2.3](https://github.com/deepstreamIO/deepstream.io/releases/tag/v2.3.2)! It contains quite a few radical improvements that are aimed to provide developers the tools to cater for more complex use cases.

Here are some of the highlights:

- [Pure Publishers:](#setting-data) allowing providers to insert data without needing to subscribe.

- [Hot Paths:](#hot-paths) allow deepstream to supercharge trusted records by bypassing validation.

- [Performance Improvements:](#performance-improvements) even more performance improvements!

- [Generic Plugins:](#generic-plugins) add any type of plugin into the deepstream.io ecosystem, allowing you to augment workflows and switch out subsystems.

- [Connection Endpoints:](#connection-endpoints) give you the tools to implement your favourite transport layer or realtime protocol, or go wild and write one from scratch.

<div>
  <img src="2.3-deepstream.io.jpg" alt="deepstream.io 2.3" />
</div>

## Setting Data

Built to be an extremely fast realtime server, deepstream allows users to collaborate on shared objects and aims to synchronise state between them in microseconds. The realtime protocol supports object deltas and active publishing paradigms to help you squeeze as much relevant data into a system as possible, while maintaining consistency.

However, one pattern we realised occurs more often than not is where a single provider is really active, sending updates to tens of thousands of unique records a second, without ever really needing to subscribe to any of them.

Because of this we are proud to announce the new `setData` API in all of our clients and server. It allows providers and publishers to update deepstream with the classical performance benefits of bulk insertions, without losing any of the realtime benefits of notifying all users!

Using the old publisher approach, publishers would have to retrieve each record they wanted to write to:

```javascript
const record = client.record.getRecord('releases/2.2')
record.whenReady((record) => {
  record.set(
    {
      releaseVersion: '2.2',
      type: 'awesome'
  	},
    error => console.log('pre version 2.3')
  )
  record.discard()
})’
```

Now publishers can set data directly on the record:

```javascript
client.record.setData(
  'releases/2.3',
  {
	releaseVersion: '2.3',
	type: 'more awesome'
  },
  error => console.log('2.3 released!')
)
```

## Hot Paths

We took `setData` one step further by allowing administrators to specify an optional list of record prefixes to indicate records that have no possibility of version conflicts. By doing so, we are able to bypass loading the records previous state for version validation, and by no longer relying on the records previous state or payload validation, we can now improve performance over *20-fold* from the approaches used prior to this release.

```yaml
storageHotPathPatterns:
  - analytics/
  - metrics/
```

## Performance Improvements

Since we were already embarked on a performance-driven voyage, we decided to see how much further we could get. We profiled deepstream continuously to see what the biggest gains were. Most of the changes were purely micro optimizations, but we significantly reduced the possibility of CPU reaching 100%, helping prevent the server from creating a large backlog or introducing delays.

The largest improvement however was allowing us to patch non critical updates, such as subscription acknowledgements and errors. By doing so, we reduced socket writes by almost 50% for subscription paths!

```yaml
# The amount of milliseconds before flushing non critical writes
outgoingBufferTimeout: 20
```

## Generic Plugins

The core of deepstream has always been based on freedom of choice. You can plug and play your own selection of cache, storage, message bus, logger, authentication handler and permission plugins (talk about flexibility!) to best suit your needs and comfort. But we often ask ourselves, is that truly enough? Wouldn't it be awesome if you had the ability to:

 - pick between having centralised or decentralised cluster state
 - spin up an http server that would allow you to kick out users or dynamically update permissions
 - gain insights into all sorts of usage metrics
 - register your own extensions to the deepstream protocol

While not all of the above are available right now, we have made huge head way in allowing you to inject any sort of plugin into deepstream. This allows you to load your plugins using the flexible plugin loading interface used for all our core plugins.

```yaml
plugins:
  permission-reloader:
    name: deepstream.io-permission-reloader
    options:
      host: 9090
```

## Connection Endpoints

Last but certainly not least, we have removed our direct dependency on websockets as a networking layer. This is the first step in allowing users to decide on different transmission protocols such as directly using tcp or udp, or different networking protocols such as http, engine.io, mqtt or maybe even radio waves for intense IoT devices!

To do so we have improved the distinction between the core logic and networking layers. Although we currently allow a single connection endpoint per server, you can cluster servers to mix and match all your different endpoints to allow all your different devices to communicate as a swarm!

```yaml
connectionEndpoints:
  websocket:
    name: uws
    options:
        # port for the websocket server
        port: 6020
        # host for the websocket server
        host: 0.0.0.0
 ```
