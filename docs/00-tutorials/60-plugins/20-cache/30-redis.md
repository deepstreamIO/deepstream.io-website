---
title: Redis Cache Connector
description: Learn how to use Redis with deepstream for cache
logoImage: redis.png
---

`markdown:redis-description.md`

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
