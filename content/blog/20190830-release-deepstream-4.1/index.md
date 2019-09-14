---
title: "Release: Deepstream 4.1" 
description: Deepstream V3 and below compatibility support!
redirectFrom: [/releases/server/v4-1-0/]
---

### Features:

Backwards compatibility with V3 clients / text protocol using a ws-text connection endpoint!

This has a couple of small differences, like `has` is no longer supported and `snapshot` errors
are exposed using the global `error` callback instead of via the response. Otherwise all the e2e 
tests work, and best of all you can run both at the same time if you want to run JS 4.0 
and Java 3.0 simultaneously!

It is worth keeping in mind there is a small CPU overhead between switching from V3 custom deepstream
encoding to JSON (V4), so it is advised to monitor your CPU when possible!

```
- type: ws-text
    options:
        # port for the websocket server
        port: 6021
        # host for the websocket server
        host: 0.0.0.0
```