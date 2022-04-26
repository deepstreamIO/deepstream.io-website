---
title: JSON Endpoint
description: Learn how to configure a JSON based  Websocket Endpoint
wip: true
logoImage: json.png
---

The JSON endpoint is available to help people to debug writing new SDKs and should not be used in production.

### How to configure:

#### server

```yaml
connectionEndpoints:
  - type: ws-json
    options:
      # url path websocket connections connect to
      urlPath: /deepstream-json
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

#### client

In the client options include:

```
socketOptions: {
  jsonTransportMode: true
}
```
