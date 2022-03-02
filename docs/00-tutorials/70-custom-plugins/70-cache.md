---
title: Cache Plugin
description: Building your own cache plugin
---

Create a plugin to connect to any type of cache system out there, just remember to keep it fast!

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/cache/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/cache/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/cache/deepstream-setter.ts`

### Example Documented Plugin


`embed: server/example-plugins/src/cache/node-cache.ts`