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
      # enable the authentication endpoint for requesting tokens/userData.
      # note: a custom authentication handler is required for token generation
      enableAuthEndpoint: false
      # path for authentication requests
      authPath: /auth
      # path for POST requests
      postPath: /
      # path for GET requests
      getPath: /
      # should the server log invalid auth data, defaults to false
      logInvalidAuthData: false
      # http request timeout in milliseconds, defaults to 20000
      requestTimeout: 20000
```