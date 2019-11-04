---
title: Authentication Plugin
description: Building your own authentication plugin
---

Learn how to create an authentication plugin to verify a users ability to connect, as well as
provide data that can be used for permissioning further on.

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/auth/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/auth/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/auth/deepstream-setter.ts`

### Example Documented Plugin

`embed: server/example-plugins/src/auth/token-authentication.ts`