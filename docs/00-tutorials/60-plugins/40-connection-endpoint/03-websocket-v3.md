---
title: V3 Text Protocol
---

### How to configure:

```yaml
connectionEndpoints:
  - type: ws-text
    options:
      # url path websocket connections connect to
      urlPath: /deepstream-v3
      # the amount of milliseconds between each ping/heartbeat message
      heartbeatInterval: 30000
      # the amount of milliseconds that writes to sockets are buffered
      outgoingBufferTimeout: 10
      # the maximum amount of bytes to buffer before flushing, stops the client from large enough packages
      # to block its responsiveness
      maxBufferByteSize: 100000

      # Security
      # amount of time a connection can remain open while not being logged in
      unauthenticatedClientTimeout: 180000
      # invalid login attempts before the connection is cut
      maxAuthAttempts: 3
      # maximum allowed size of an individual message in bytes
      maxMessageSize: 1048576
      # optional required headers
      headers: []
```