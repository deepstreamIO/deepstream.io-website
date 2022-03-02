---
title: Memcached Cache Connector
description: Learn how to use Memcached with deepstream
logoImage: memcached.png
---

*** Memcached not upgraded to V4/V5. Please [refer to this github issue](https://github.com/deepstreamIO/deepstream.io/issues/973) if you require this ***

#### What is Memcached?
[Memcached](https://memcached.org/) is a distributed caching system. All its data is purely kept in memory which means two things:

- its very fast
- everything is gone if you pull the plug.That's not necessarily a bad thing, but it means you need some sort of persistent database layer as well if you choose to go with Memcached.

#### Why use Memcached with deepstream?
For two reasons: Speed and scale. Memcached can power large clusters and writes and reads data very quickly. The memcached protocol has also seen some wider adoption, e.g. by [Hazelcast](../hazelcast/), so if you do decide to change caches at some point, migration might be quite easy.

#### I want to use AWS Elasticache with deepstream. Should I choose Memcached or Redis as a caching-engine?
Redis! Memcached is a great cache, but Redis also saves data to disk and can act as a message-bus for smaller deepstream clusters, giving you all the functionality you need.

#### How to use Memcached with deepstream?
deepstream comes preinstalled with an official connector for Memcached.

If you are using deepstream from Node, you can also install it via [NPM](https://www.npmjs.com/package/@deepstream/cache-memcached)

#### Configuring the Memcached connector
You can configure memcached in the plugin section of deepstream's config.yml file

```yaml
plugins:
  cache:
    name: memcached
    options:
      serverLocation: [ 'localhost:11211' ] # One or more endpoint URLs
```
