---
title: Cluster Node Plugin
description: Building your own cluster node plugin
---

Create a plugin that allows deepstream nodes to connect to each other and scale

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/cluster-node/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/cluster-node/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/cluster-node/deepstream-setter.ts`

### Example Documented Plugin

`embed: server/example-plugins/src/cluster-node/vertical-cluster-node.ts`