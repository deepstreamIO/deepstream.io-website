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
      # maximum allowed size of an individual message in bytes
      maxMessageSize: 1024
```