---
title: UWS HTTP
description: Learn how to configure the UWS HTTP Service
logoImage: uws.svg
---

UWS is enabled throughout all endpoints by setting the httpServer type to uws.

Important:

UWS does not work on alpine images and returns C++ error traces on failure. If you run into
a bug please try it out with the default http server to see if it can be reproduced on both
types.

Currently uws doesn't have as many configurations options as the node server, but this
will be expanded in the future, please raise an issue for anything you thing is missing.

To enable SSL on uws, all you need to do is pass in the location to a key and cert.

You can either do this using an explicit path:

```yaml
key: /location/to/ssl/key.pem
```

or relative to the config file (less likely on a production install):

```yaml
key: file(relative/to/config/ssl/key.pem)
```

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
    # Options required to create an ssl app
    # ssl:
    #   key: file(ssl/key.pem)
    #   cert: file(ssl/cert.pem)
    ##  dhParams: ...
    ##  passphrase: ...
```