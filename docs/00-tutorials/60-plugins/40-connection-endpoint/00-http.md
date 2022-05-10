---
title: HTTP Endpoint
description: Learn how to configure a HTTP Endpoint
wip: true
logoImage: http.png
---

### How to configure:

```yaml
connectionEndpoints:
  - type: http
    options:
      # allow 'authData' parameter in POST requests, if disabled only token and OPEN auth is
      # possible
      allowAuthData: true
      # path for POST requests
      postPath: /api
      # path for GET requests
      getPath: /api
      # should the server log invalid auth data, defaults to false
      logInvalidAuthData: false
      # http request timeout in milliseconds, defaults to 20000
      requestTimeout: 20000
```