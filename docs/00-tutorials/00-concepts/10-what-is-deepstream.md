---
title: What is deepstream?
---

Hey, it’s good to see that you’ve stumbled upon this page. deepstream is an incredibly powerful concept, but it’s also quite different and can be a lot to wrap your head around at first. So let's get down to the bottom of what exactly it is and how it works.

### What is it?
deepstream is a standalone realtime server that can be run on all major platforms. It's also a node server than can be easily extended with custom logic in almost all cases.

Clients establish persistent, bidirectional WebSocket connections with the deepstream server using lightweight SDKs that are available for [Browsers/Node](/tutorials/getting-started/javascript/) and [Java/Android](https://github.com/deepstreamIO/deepstream.io/issues/72) and soon/partially as well for [iOS(ObjC/Swift)](https://github.com/deepstreamIO/deepstream.io/issues/68), [Python](https://github.com/deepstreamIO/deepstream.io/issues/72), [.NET](https://github.com/deepstreamIO/deepstream.io/issues/70) and [C/C++](/deepstreamIO/deepstream.io/issues/69).

The server itself is [configurable](/docs/server/configuration/) and uses [permission files](/docs/tutorials/core/permission/valve-introduction/) to validate incoming messages, but doesn’t hold any custom logic other than that. All logic is provided by “clients” which can be backend processes as well as end-users. deepstream provides numerous features such as [listening and active subscriptions](/docs/tutorials/core/active-data-providers/) to hook into what users request and provide/transform data accordingly as well as integrate and retrieve data from third party components or APIs.
This makes deepstream useful as both a realtime server for mobile/browser and desktop clients as well as a backbone for microservice architectures.

What is it for?

deepstream is useful as a backend for most applications, but is mostly used for

- Collaboration apps like Google Docs or Trello
- Fast trading, gambling or auction platforms
- Messengers and social interaction
- Financial reporting and risk control
- Casual and Mobile multiplayer games
- Realtime dashboards and analytic systems
- IoT metric gathering and control
- Stock / Inventory control
- Process management systems

### What does it do?

deepstream provides four core concepts:
- **[Data-sync:](/docs/tutorials/core/datasync/records/)** stateful and persistent JSON objects that can be manipulated in whole or in parts and are synchronized across all connected clients
- **[Pub-Sub:](/docs/tutorials/core/pubsub/)** many-to-many messaging based on subscriptions to topics
- **[Request-Response:](/docs/tutorials/core/request-response/)** RPC question/answer workflows
- **[Presence:](/docs/tutorials/core/presence/)** Query on the connected clients

### What does it not do?
deepstream is a realtime data server that can handle all aspects of your application's logic. But:

It is not an HTTP server, so won’t be able to serve images, HTML or CSS files. When you’re building a webapp we recommend using a CDN and something like Github pages or AWS S3 to serve your static assets and leave the dynamic data to deepstream.

### What can it be compared to?
The most frequent comparison is a “self hosted Firebase”. That’s quite close although deepstream also offers pub/sub and request/response and breaks its data down into small objects called “records” with individual life cycles, rather than Firebase’s monolithic single tree structure. This makes it conceptually closer to the way financial trading or multiplayer game servers are built - as well as magnitudes faster. Please find more about about the realtime space and how deepstream sits within it in our overview of realtime frameworks.

### What can it integrate with?

deepstream can optionally be integrated with two types of systems:
- Databases can be used for long-term data storage and querying
- Caches can be used for fast, short-term data access

Connectors are available for many popular systems, e.g. [Postgres](/tutorials/plugins/database/postgres/), [RethinkDB](/tutorials/plugins/database/rethinkdb/), [MongoDB](/tutorials/plugins/database/mongodb/), [Redis](/tutorials/plugins/cache/redis/) or [ElasticSearch](/tutorials/plugins/database/elasticsearch/) and can also easily be written yourself.

If no external system is specified, deepstream will run as a single node and store data in internal memory, but won't persist it to disk.

### How is security handled?
deepstream supports [encrypted connections](/docs/tutorials/core/security/)
and [multiple authentication strategies](/docs/tutorials/core/auth/http-webhook/) to
validate incoming connections. It also uses a granular permission language
called [_Valve_](/docs/tutorials/core/permission/valve-introduction/) that lets you
configure exactly which user can manipulate which record, event or rpc with
which data.

### How far does it scale?
deepstream nodes are built as small, single threaded processes with asynchronous I/O that scale in clusters, designed to work well in cloud environments. A single node can comfortably stream 160.000-200.000 updates a second.
Recent benchmarks ran a cluster of six nodes on AWS EC2 t2.medium instances for an hour, delivering four billion messages (at a total AWS cost of 36 cents).

### What is it written in?
Mostly nodeJS, with native nodeJS plugins like the uws websocket server that be used for superior memory and cpu efficiency.

### Who’s behind it?
It was started by Yasser Fadl and Wolfram Hempel, two trading technology geeks that used to build similar systems for Investment Banks and Hedge Funds in London until they’ve decided to move into open source.
