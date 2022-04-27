---
title: Redis Cluster Connector
---

#### How to use Redis for clustering with deepstream?

The nodejs cluster comes preinstalled in the node binary, and can also be installed via [NPM](https://www.npmjs.com/package/@deepstream/clusternode-redis) if your using as node.

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
