---
title: Storage Plugin
description: Building your own storage plugin
---

Create a plugin to connect to any type of storage system out there, be it file, memory, disk, a url
or anything else.

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/storage/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/storage/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/storage/deepstream-setter.ts`

### Example Documented Plugin

`embed: server/example-plugins/src/storage/file-storage.ts`