---
title: Node HTTP
description: Learn how to configure the node HTTP Service
wip: true
---

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
```