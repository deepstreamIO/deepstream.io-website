---
title: Logger Plugin
description: Building your own logger plugin
---

Create your own logger to interact with your favorite logging platform or filter logs to what you 
want exactly.

You can see the code for this [here](https://github.com/deepstreamIO/deepstream.io-example-plugins)

### Configuring the plugin

1) Via config.yml:
`embed: server/example-plugins/src/logger/config.yml`

2) Via deepstream constructor:
`embed: server/example-plugins/src/logger/deepstream-constructor.ts`

3) Via deepstream setter:
`embed: server/example-plugins/src/logger/deepstream-setter.ts`

### Example Documented Plugin


`embed: server/example-plugins/src/logger/pino-logger.ts`