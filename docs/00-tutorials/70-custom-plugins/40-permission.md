---
title: Permission Plugin
description: Building your own permission plugin
---

Learn the basics of creating a permission plugin, allowing you to allow or deny actions down to a per
message basis.

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/permission/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/permission/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/permission/deepstream-setter.ts`

### Example Documented Plugin

`embed: server/example-plugins/src/permission/username-permission.ts`