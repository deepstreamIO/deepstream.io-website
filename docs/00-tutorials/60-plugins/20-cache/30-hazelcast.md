---
title: Hazelcast Cache Connector
---
:::caution
*** Hazelcast not upgraded to V4/V5. Please refer to [this github issue](https://github.com/deepstreamIO/deepstream.io/issues/972) if you require this ***
:::

#### What is Hazelcast?
Hazelcast is a distributed caching layer, organized as a grid of independent nodes that sync their state. On top of that, Hazelcast allows to perform computations based on the stored data and even supports basic server side messaging.

#### Why use Hazelcast with deepstream?
Hazelcast can be a good choice as a fast and scalable caching layer for deepstream. It can outperform other caches like Redis in cluster-mode, but is a bit trickier to set up.
Where Hazelcast really comes into its own is the additional Map-Reduce functionality built on top of its caching capabilities. This makes it possible to perform simple, distributed computations based on record data and feed the results back to deepstream.

![Hazelcast Diagram](/img/tutorials/60-plugins/hazelcast-diagram.png)

#### Using Hazelcast with deepstream
deepstream comes with a cache connector for Hazelcast preinstalled

or, if you're using deepstream in Node, [get it from NPM](https://www.npmjs.com/package/@deepstream/cache-hazelcast)

#### Configuring the Hazelcast connector

You can configure the Hazelcast cache connector in the plugins section of deepstream's config.yml file. Please find a full list of configuration options [here](http://hazelcast.github.io/hazelcast-nodejs-client/api/0.3/docs/modules/_config_.html)
```yaml
plugins:
    cache:
      name: hazelcast
      options:
        networkConfig:
          addresses:
            - host: hostname
              port: 1234

```
