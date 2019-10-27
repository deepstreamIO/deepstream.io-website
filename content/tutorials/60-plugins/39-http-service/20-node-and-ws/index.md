---
title: Node HTTP
description: Learn how to configure the node HTTP Service
---

Node is the default HTTP server as it supports all platforms and is much easier to debug.

To enable SSL, all you need to do is pass in the the loaded file and cert.

You can either do this using an explicit path:

```yaml
ssl:
  key: fileLoad(/location/to/ssl/key.pem)
  cert: fileLoad(/location/to/ssl/key.pem)
```

or relative to the config file (less likely on a production install):

```yaml
ssl:
  key: fileLoad(ssl/key.pem)
  cert: fileLoad(ssl/key.pem)
```

### How to configure:

```yaml
httpServer:
  type: default
  options:
    # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
    healthCheckPath: /health-check
    # -- CORS --
    # if disabled, only requests with an 'Origin' header matching one specified under 'origins'
    # below will be permitted and the 'Access-Control-Allow-Credentials' response header will be
    # enabled
    allowAllOrigins: true
    # a list of allowed origins
    origins:
      - 'https://example.com'
    # Headers to copy over from websocket
    headers:
      - user-agent
    # Options required to create an ssl app
    # ssl:
    #   key: fileLoad(ssl/key.pem)
    #   cert: fileLoad(ssl/cert.pem)
    #   ca: ...
```