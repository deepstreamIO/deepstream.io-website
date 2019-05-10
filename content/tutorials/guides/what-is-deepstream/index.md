---
title: What is deepstream?
description: A general introduction
---
<style type="text/css">
.main-title{display:none}
.content li {
    padding: 0 20px;
    position: relative;
    line-height: 26px;
}</style>
![What is deepstream?](what-is-deepstream-header.png)

Hey, it’s good to see that you’ve stumbled upon this page. deepstream is an incredibly powerful concept, but it’s also quite different and can be a lot to wrap your head around at first. So let's get down to the bottom of what exactly it is and how it works.

### What is it?
deepstream is a standalone server that is installed the same way you’d install say Nginx or most databases. It’s available [via package managers for most Linux distributions as well as executable for Windows and Mac](/install/).

Clients establish persistent, bidirectional WebSocket connections with the deepstream server using lightweight SDKs that are available for [Browsers/Node](/tutorials/guides/getting-started-quickstart/#getting-the-client) and [Java/Android](/install/android/) and soon/partially as well for [iOS(ObjC/Swift)](https://github.com/deepstreamIO/deepstream.io/issues/68), [Python](https://github.com/deepstreamIO/deepstream.io/issues/72), [.NET](https://github.com/deepstreamIO/deepstream.io/issues/70) and [C/C++](/deepstreamIO/deepstream.io/issues/69).

The server itself is [configurable](/docs/server/configuration/) and uses [permission files](/tutorials/core/permission/conf-simple/) to validate incoming messages, but doesn’t hold any logic other than that. All logic is provided by “clients” which can be backend processes as well as end-users. deepstream provides numerous features such as [listening and active subscriptions](/tutorials/core/active-data-providers/) to hook into what users request and provide/transform data accordingly as well as integrate and retrieve data from third party components or APIs.
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
deepstream provides three core concepts:
- **[Data-sync:](/tutorials/core/datasync/records/)** stateful and persistent JSON objects that can be manipulated in whole or in parts and are synchronized across all connected clients
- **[Pub-Sub:](/tutorials/core/pubsub/)** many-to-many messaging based on subscriptions to topics
- **[Request-Response:](/tutorials/core/request-response/)** Question/Answer workflows

### What does it not do?
deepstream is a realtime data server that can handle all aspects of your application's logic. But: 

It is not an HTTP server, so won’t be able to serve images, HTML or CSS files. When you’re building a webapp we recommend using a CDN and something like Github pages or AWS S3 to serve your static assets and leave the dynamic data to deepstream.

It does not handle binary data. deepstream uses a minimal, proprietary text-based protocol - so it won’t be able to help with file uploads, video streaming or similar tasks.

### What can it be compared to?
The most frequent comparison is a “self hosted Firebase”. That’s quite close although deepstream also offers pub/sub and request/response and breaks its data down into small objects called “records” with individual life cycles, rather than Firebase’s monolithic single tree structure. This makes it conceptually closer to the way financial trading or multiplayer game servers are built - as well as magnitudes faster. Please find more about about the realtime space and how deepstream sits within it in our overview of realtime frameworks.

### What can it integrate with?
deepstream can optionally be integrated with three types of systems:
- Databases can be used for long-term data storage and querying
- Caches can be used for fast, short-term data access
- Message Busses can be used for deepstream nodes to communicate with each other

Connectors are available for many popular systems, e.g. [RethinkDB](/tutorials/plugins/database/rethinkdb/), [MongoDB](/tutorials/plugins/database/mongodb/), [Redis](/tutorials/plugins/cache/redis/), [AMQP](/tutorials/integrations/msg-amqp/), [Kafka](/tutorials/integrations/msg-kafka/) or [ElasticSearch](/tutorials/plugins/database/elasticsearch/) and can also easily be written yourself. This animation aims to provide an impression of how deepstream interacts with other systems

![how it works](/tutorials/core/cluster-messaging/internal-workings.svg)

If no external system is specified, deepstream will run as a single node and store data in internal memory, but won't persist it to disk.

### How is security handled?
deepstream supports [encrypted connections](/tutorials/core/security/)
and [multiple authentication strategies](/tutorials/core/auth/http-webhook/) to
validate incoming connections. It also uses a granular permission language
called [_Valve_](/tutorials/core/permission/conf-simple/) that lets you
configure exactly which user can manipulate which record, event or rpc with
which data.

### How far does it scale?
deepstream nodes are built as small, single threaded processes with asynchronous I/O that scale in clusters, designed to work well in cloud environments. A single node can comfortably stream 160.000-200.000 updates a second.
Recent benchmarks ran a cluster of six nodes on AWS EC2 t2.medium instances for an hour, delivering four billion messages (at a total AWS cost of 36 cents).

### How fast is it?
Benchmarks have shown that even under load the average latency for deepstream messages is ~1ms. The biggest factor in deepstream deployments is usually network proximity - if your server is in Sweden, but your users are in Japan, your information will need time to travel.

### What is it written in?
Probably one of the most controversial decision, but one we’ve spend a lot of time researching and are super happy with: a rare, but very fast and efficient combination of low level C for messaging and networking and Node logic, compiled into a self contained executable.

### Who’s behind it?
deepstream is developed by a small, but fast growing company in Berlin’s bustling startup scene, backed by some of Europe’s most exciting VCs. It was started by Yasser Fadl and Wolfram Hempel, two trading technology geeks that used to build similar systems for Investment Banks and Hedge Funds in London until they’ve got somewhat irritated by this world and decided to move into open source.
