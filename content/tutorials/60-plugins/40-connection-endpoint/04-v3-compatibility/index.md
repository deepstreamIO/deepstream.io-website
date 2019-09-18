---
title: WebSocket Connection
description: Learn how to configure a V3 compatible endpoint
wip: true
---

### How to configure:

```yaml
connectionEndpoints:
  - type: v3-compatibility
    options:
        # port for the websocket server
        port: 6021
        # host for the websocket server
        host: 0.0.0.0
        # url path websocket connections connect to
        urlPath: /deepstream
        # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
        healthCheckPath: /health-check
        # the amount of milliseconds between each ping/heartbeat message
        heartbeatInterval: 30000
        # the amount of milliseconds that writes to sockets are buffered
        outgoingBufferTimeout: 10
        # the maximum amount of bytes to buffer before flushing, stops the client from large enough packages
        # to block its responsivness
        maxBufferByteSize: 100000

        # Headers to copy over from websocket
        headers:
          - user-agent

        # Security
        # amount of time a connection can remain open while not being logged in
        unauthenticatedClientTimeout: 180000
        # invalid login attempts before the connection is cut
        maxAuthAttempts: 3
        # if true, the logs will contain the cleartext username / password of invalid login attempts
        logInvalidAuthData: false
        # maximum allowed size of an individual message in bytes
        maxMessageSize: 1048576
```