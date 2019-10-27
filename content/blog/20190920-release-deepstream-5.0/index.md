---
title: "Release: Deepstream 5.0" 
description: The MIT Resurrection
redirectFrom: [/releases/server/v5-0-0/]
blogImage: ./5.0-release.png
---

<div style="height: 300px;
    width: 100%;
    background-repeat: repeat;
    display: inline-block;
    background-size: 275px 300px;
    background-image: url(/images/eltons/elton-zombie.svg);
    animation: pulse 3s infinite;">
</div>

### Features:

- New License
- Singular HTTP Service
- SSL Support reintroduced
- Better Config file validation
- JSON Logger
- NGINX Helper
- Combined authentication handler
- Embedded dependencies
- Builtin HTTP Monitoring
- Storage authentication endpoint
- Guess whats back, official clustering support!

### Backwards compatibility

- Custom authentication plugins now have to use the async/await API
- Custom permission handlers need to slightly tweak the function arguments
- Deployment configuration has to be (simplified) to respect the single HTTP/Websocket port

### Upgrade guide

You can see the upgrade guide for backwards compatibility [here](/tutorials/upgrade-guides/v5/server/)

## TLDR:

### BACK TO MIT LICENSE

This part deserves its own post and I can't try to do it justice here. The summary is that all deepstream components will be released using the MIT license, starting with the heavily worked on Server and Client in V5. What exactly does this mean?

- Clustering is open source (with redis support out of the box on docker and binaries)
- Monitoring endpoint is open source

## Single HTTP Service

After working with multiple clients on deploying deepstream we realized one large annoyance was how our plugins previously ran in isolation. What this meant was that we would run our HTTP service under port 8080, deepstream on 6020, and all the other
services on different ports (like monitoring and such). This has a massive limitation of having to constantly update the deployment config to respect the ports, as well as generally just not supporting more then one on some load balancers.

The other issue was that we had multiple different network stacks running in deepstream with code duplicated in all those endpoints. 

In V4 (and prior) we had config that looked like this (ignoring a bunch of configuration options and extra endpoints):

```yaml
connectionEndpoints:
  - type: ws-websocket
    options:
        # port for the websocket server
        port: 6020
        # host for the websocket server
        host: 0.0.0.0
        # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
        healthCheckPath: /health-check

  - type: node-http
    options:
      # port for the http server
      port: 8080
      # host for the http server
      host: 0.0.0.0
      # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
      healthCheckPath: /health-check

  - type: uws-websocket
    options:
        # port for the websocket server
        port: 6020
        # host for the websocket server
        host: 0.0.0.0
        # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
        healthCheckPath: /health-check

        # SSL Configuration
        sslKey: null
        sslCert: null
        sslDHParams: null
        sslPassphrase: null
```

What this means is every single endpoint was responsible for setting up its own HTTP/Websocket Server, health-checks, SSL certification and so forth.

Now lets take a look at V5:

```yaml
httpServer:
  type: default
  options:
    # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
    healthCheckPath: /health-check
    # -- CORS --
    # if disabled, only requests with an 'Origin' header matching one specified under 'origins'
    # below will be permitted and the 'Access-Control-Allow-Credentials' response header will be
    # enabled
    allowAllOrigins: true
    # a list of allowed origins
    origins:
      - 'https://example.com'
    # Headers to copy over from websocket
    headers:
      - user-agent

# Connection Endpoint Configuration
connectionEndpoints:
  - type: ws-binary
    options:
      urlPath: /deepstream
      ...

  - type: ws-text
    options:
      urlPath: /deepstream-v3
      ...

- type: ws-json
    options:
      urlPath: /deepstream-json
      ...

  - type: http
    options:
        ...
```

Different right? The idea here is the entire connection stack can now share a global HTTP server via some nifty HTTP helpers:

```javascript
// Register a HTTP Post Route
this.services.httpService.registerPostPathPrefix(prefix, (body, meta, response) => {
  response(error, responseData)
})

// Register a HTTP Get Route
this.services.httpService.registerGetPathPrefix(prefix, (meta, response) => {
  response(error, responseData)
})

// Registering a WebSocket Endpoint
this.services.httpService.registerWebsocketEndpoint(urlPath, createWSSocketWrapper, {
  onConnection: (socketWrapper) => {},
  onSocketClose: (socketWrapper) => {}
}

// Send a websocket message, this is abstracted since the API changes between node and uws
this.services.httpService.sendWebsocketMessage(socket, message, isBinary)

// Return all socket associated to a specific user, regardless what connection endpoint is being
// used. Useful to kick out users in bulk
this.services.httpService.getSocketWrappersForUserId(userId)
```

The best part about this is that you can change the httpServer to uws to have the entire server run 
using it

```yaml
httpServer:
  type: uws
  options:
    # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
    healthCheckPath: /health-check
```

## SSL Reintroduced

SSL was removed from the V4 server because of the multiple ports issue. We recommend (and still do!) that 
our customers deploy SSL in production via SSL termination, such as that provided with Nginx and all modern
load balancers.

However, sometimes we don't want to justify having to run an entire separate process (clouds ain't cheap) 
just to have a demo application running. Because of that, and the introduction of our new `fileLoad` and 
`file` config macros we can now enable SSL by just doing the following:

```yaml
httpServer:
  type: default
  options:
    # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
    healthCheckPath: /health-check
    # -- CORS --
    # if disabled, only requests with an 'Origin' header matching one specified under 'origins'
    # below will be permitted and the 'Access-Control-Allow-Credentials' response header will be
    # enabled
    allowAllOrigins: true
    # a list of allowed origins
    origins:
      - 'https://example.com'
    # Headers to copy over from websocket
    headers:
      - user-agent
    # Options required to create an ssl app
    ssl:
      key: fileLoad(ssl/key.pem)
      cert: fileLoad(ssl/cert.pem)
    #   ca: ...
```

OR

```yaml
type: uws
options:
  # url path for http health-checks, GET requests to this path will return 200 if deepstream is alive
  healthCheckPath: /health-check
  # Headers to copy over from websocket
  headers:
    - user-agent
  # Options required to create an ssl app
  ssl:
    key: file(ssl/key.pem)
    cert: file(ssl/cert.pem)
  ##  dhParams: ...
  ##  passphrase: ...
  ```

### Better Config file validation

Remember when you would stare at the screen with despair because you would get an error like 
this `Invalid configuration: data should NOT have additional properties` and have no idea why
or where its from?

V5 now uses some smarter error handling, allowing you to get errors that make a bit more sense.

```
There was an error validating your configuration:
1) Property listens is not expected to be here
2)/logger/type should be equal to one of the allowed values: default, Did you mean default?
```

### JSON Logger

You can now use a JSON logger for deepstream (useful for streaming data to ELK stack and so forth) by
setting the name of the logger to pino

```
logger:
  name: pino
```

### NGINX Helper

You can output nginx config for deepstream (automatically generated from config) by running

```bash
deepstream nginx
```

Not the most useful command for some, but here by popular demand!

## Combined authentication handler

The Authentication mechanism has changed in order to support multiple strategies at the same time.

In V4 you could only set one auth endpoint:

```yaml
auth:
  type: open
```

When in V5 you now are required to set an array:

```yaml
auth:
  - type: open
```

What this means is when a user logs in we can check multiple different authentication mechanisms before saying a user was not found. Some useful scenarios are when you want to keep deepstream services authentication local to the server, and only forward front-end clients to a login server. Another extremely useful setup is to first check if a user is actually available, and if not give them an anonymous view (which can be extremely restricted when it comes to permissions).

This also means that individual authentication handlers moved from this API:

```javascript
isValidUser (connectionData, authData, callback) {
  callback(isValid, {
    username: 'string',
    clientData: {},
    serverData: {}
  })
}
```

To this one:

```javascript
async isValidUser (connectionData: any, authData: any) {
  // If invalid or valid
  return {
    isValid: true,
    id: 'string',
    clientData: {},
    userData: {}
  }

  // If not found, return null to allow next auth handler to 
  // try
  return null
}
```

### Embedded Dependencies

The docker image and binaries now have all the official plugins pre-bundled. This has been done to remove the whole `deepstream install` CLI. It was really painful trying to create a binary for each individual plugin and operating system (for native dependencies). Since plugins are barely changed any fixes
will be released in the following deepstream release. You can still select specific versions, but it's unlikely you would need to.

### Builtin HTTP Monitoring

Added a HTTP monitoring API which provides data in a format that can easily be consumed by a data visualization/metric tool. A guide will be released to show how this can be done using the ELK stack!

### OpenSource clustering support

This deserves a blog post for itself one day talking about the difficulties of trying to have an entirely opensource server while also being able to run a company around it. The final outcome however is
starting from V5 clustering is officially back and supported, with a redis clustering mechanism that can be used via node `@deepstream/clusternode-redis` and is shipped with deepstream binary/docker images. Happy clustering!
