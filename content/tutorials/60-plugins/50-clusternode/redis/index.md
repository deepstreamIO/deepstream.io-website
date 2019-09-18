---
title: Redis Cluster Connector
description: Learn how to use Redis with deepstream for clustering
logoImage: redis.png
---

`markdown:redis-description.md`

#### How to use Redis for clustering with deepstream?

Install via [NPM](https://www.npmjs.com/package/@deepstream/clusternode-redis)

```bash
npm install --save @deepstream/clusternode-redis
```

And can be enabled in your config file as follows:

```yaml
clusterNode:
  name: redis
  options:
    host: localhost
    port: 6379
```

Or to connect it to a redis cluster:

```yaml
clusterNode:
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
