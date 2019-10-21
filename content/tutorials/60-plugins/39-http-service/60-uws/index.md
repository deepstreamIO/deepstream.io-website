---
title: UWS HTTP
description: Learn how to configure the UWS HTTP Service
wip: true
---

### How to configure:

```yaml
httpServer:
  type: uws
  options:
    # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
    healthCheckPath: /health-check
    # Headers to copy over from websocket
    headers:
      - user-agent
```