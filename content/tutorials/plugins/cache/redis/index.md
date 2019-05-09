---
title: Redis Cache Connector
description: Learn how to use Redis with deepstream
---

#### What is Redis?
A lot of things. In fact, so many that its often referred to as the "Swiss Army Knife of the web". Redis is first and foremost a cache. It's fast, simple, single threaded with non-blocking I/O and scales well in distributed deployments (should sound familiar to deepstream fans).

But it also persists its data to disk, making it a good alternative to full-size databases for simpler usecases and can act as a publish/subscribe server for message distribution.

![Redis](redis.png)

You can easily install Redis yourself or use it as a service from your cloud hosting provider, e.g. via [AWS ElastiCache](https://aws.amazon.com/elasticache/), [Microsoft Azure](https://azure.microsoft.com/en-us/services/cache/) or [RackSpace's Object Rocket](http://objectrocket.com/). Due to its popularity there are also a number of specialized Redis hosting companies, e.g. [RedisLabs](https://redislabs.com/), [RedisGreen](http://www.redisgreen.net/), [Compose](https://www.compose.io/) or [ScaleGrid](https://scalegrid.io/), but be careful: deepstream constantly interacts with its cache, so every millisecond network latency between its server and your RedisHoster makes deepstream notably slower. We strongly recommend choosing a cache that runs in close network proximity to your deepstream servers, e.g. within the same data-center.

#### Why use Redis with deepstream?
Redis is a great fit for use with deepstream. It can be used as a cache, persists data and re-distributes messages for smaller to medium sized deepstream clusters. It won't be much help when it comes to executing complex queries, but if you can live without, Redis might be all you need for your production deployment.

#### How to use Redis with deepstream?
deepstream offers two separate plugins for Redis: a cache connector and a message connector. Both can connect to the same Redis endpoint and both offer support for standalone Redis deployments and clusters.

Install via commandline or if you're using deepstream in Node.js via NPM ([Cache](https://www.npmjs.com/package/deepstream.io-cache-redis), [Message](https://www.npmjs.com/package/deepstream.io-msg-redis))

```bash
    deepstream install msg redis
    deepstream install cache redis
```

The same configuration options for both can be set in deepstream's config.yml file

```yaml
plugins:
  cache:
    name: redis
    options:
      host: localhost
      port: 6379
  message:
    name: redis
    options:
      host: localhost
      port: 6379
```


Both connectors work with Redis clusters as well. Just adjust your options as follows:

```yaml
plugins:
   cache:
     name: redis
     options:
       nodes:
         - host: <String>
           port: <Number>
           password: <String>
         - host: <String>
           port: <Number>
       maxRedirections: 16
       redisOptions:
         password: 'fallback-password'
```
