---
title: Redis Cache Connector
---

#### What is Redis?

A lot of things. In fact, so many that its often referred to as the "Swiss Army Knife of the web". Redis is first and foremost a cache. It's fast, simple, single threaded with non-blocking I/O and scales well in distributed deployments (should sound familiar to deepstream fans).

But it also persists its data to disk, making it a good alternative to full-size databases for simpler usecases and can act as a publish/subscribe server for message distribution.

You can easily install Redis yourself or use it as a service from your cloud hosting provider, e.g. via AWS ElastiCache, Microsoft Azure or RackSpace's Object Rocket. Due to its popularity there are also a number of specialized Redis hosting companies, e.g. RedisLabs, RedisGreen, Compose or ScaleGrid, but be careful: deepstream constantly interacts with its cache, so every millisecond network latency between its server and your RedisHoster makes deepstream notably slower. We strongly recommend choosing a cache that runs in close network proximity to your deepstream servers, e.g. within the same data-center.

#### Why use Redis with deepstream?

Redis is a great fit for use with deepstream. It can be used as a cache, persists data and re-distributes messages for smaller to medium sized deepstream clusters. It won't be much help when it comes to executing complex queries, but if you can live without, Redis might be all you need for your production deployment.

#### How to use Redis as a cache with deepstream?

It comes preinstalled with the binary or if you're using deepstream in Node.js via [NPM](https://www.npmjs.com/package/@deepstream/cache-redis)

And can be enabled in your config file as follows:

```yaml
cache:
  name: redis
  options:
    host: localhost
    port: 6379
```

Both connectors work with Redis clusters as well. Just adjust your options as follows:

```yaml
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
