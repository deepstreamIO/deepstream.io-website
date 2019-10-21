---
title: HTTP Endpoint
description: Learn how to configure a HTTP Endpoint
wip: true
---

### How to configure:

```yaml
connectionEndpoints:
- type: node-http
    options:
      # port for the http server
      port: 8080
      # host for the http server
      host: 0.0.0.0
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
      # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
      healthCheckPath: /health-check

      # Headers to copy over from http request
      headers:
        - user-agent

      # -- CORS --
      # if disabled, only requests with an 'Origin' header matching one specified under 'origins'
      # below will be permitted and the 'Access-Control-Allow-Credentials' response header will be
      # enabled
      allowAllOrigins: true
      # a list of allowed origins
      origins:
        - 'https://example.com'
      # maximum allowed size of an individual message in bytes
      maxMessageSize: 1024
```