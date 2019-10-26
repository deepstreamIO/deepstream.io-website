---
title: Upgrading the server
description: Upgrading the deepstream server to V5
---

The following breaking changes were introduced in V5, sorted by easiest to hardest:

### Config renames

The following configuration options were renamed in config.yml due to adding a spell checker in visual code:

- dependencyInitialisationTimeout to dependencyInitializationTimeout

This way probably not used by anyone in V4, will be explained further down in it's own section.

- path() to file()

### Usage of fileLoad() and file() in config.yml

In V4 we introduced the ability to have custom plugins, and as we added new ones we realized that we really
don't want to be bogged down by simple details like reading config files, adjusting relative paths and ensuring
they exist. So we introduced two new helper macros. These have now been used for all files related mechanisms.

#### fileLoad(filename.yml)

```yaml
# reading users and passwords from a file
type: file
options:
  # Path to the user file. Can be json, js or yml
  path: fileLoad(users.yml)
```

This macro will:

1. Ensure the file exists
2. Load the file from the file system
3. Attempt to parse the file (currently supporting json and yml extensions), otherwise just leave it as text.
4. If that all works, replaces the `fileLoad(users.yml)` with the actual data


#### file(filename.yml)

```yaml
type: uws
options:
  key: file(cert/key.pem)
  cert: file(cert/cert.pem)
```

This macro will inform deepstream that the file is relative to the `config.yml` file. This is not
as useful as fileLoad but could be used if your plugin needs to reference an actual file (due to the 
library underneath). 

The two places you would need to change these are:

1) Valve

V5:

```yaml
permissions: fileLoad(permissions.yml)
```

V4:

```yaml
path: permissions.yml
```

2) User Authentication

V5:

```yaml
users: fileLoad(users.yml)
```

V4:

```yaml
path: users.yml
```

### No longer required to run all plugins and connection endpoints on separate ports

This change is more of a infrastructure concern *IF* you used both HTTP and WS at the same time.

If you use nginx please look at the [new simplified config](/tutorials/devops/nginx/) to get deepstream
working.

The idea is now *EVERYTHING* (minus MQTT) runs on port 6020, which makes deployments much easier. This
has been introduced by the use of a HTTP Service.

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
    ssl:
      key: fileLoad(/path/to/sslKey)
      cert: fileLoad(/path/to/sslCert)
      ca: fileLoad(/path/to/caAuth)
```

OR 

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
    ssl:
      key: file(ssl/key.pem)
      cert: file(ssl/cert.pem)
    ##  dhParams: ...
    ##  passphrase: ...
```

All websocket / HTTP services now hook into this server to provide their own functionality. This means you can run
all the servers at the same time on different ports if you want (for example text, binary and JSON).

The following config is now used for deepstream, please note the following important changes:

#### All server based concepts like path/port have been removed

#### Type name changes:
1) ws-websocket to ws-binary
2) node-http to http

#### Removal of UWS, we now use UWS or a node HTTP server to drive all of deepstream and not individual parts

#### Path changes. Now that they are all on the same server we use the following paths:

1) Binary (V4/V5 clients): */deepstream*
2) Text (V3/V2 clients): */v3-deepstream*
3) JSON (V4 debug builds): */deepstream-json*
4) HTTP Post/Get: */api* and */api/auth*

```yaml
# Connection Endpoint Configuration
connectionEndpoints:
  - type: ws-binary
    options:
      # url path websocket connections connect to
      urlPath: /deepstream
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

  - type: http
    options:
      # allow 'authData' parameter in POST requests, if disabled only token and OPEN auth is
      # possible
      allowAuthData: true
      # enable the authentication endpoint for requesting tokens/userData.
      # note: a custom authentication handler is required for token generation
      enableAuthEndpoint: false
      # path for authentication requests
      authPath: /api/auth
      # path for POST requests
      postPath: /api
      # path for GET requests
      getPath: /api
      # maximum allowed size of an individual message in bytes
      maxMessageSize: 1024

  - type: mqtt
    options:
        # port for the mqtt server
        port: 1883
        # host for the mqtt server
        host: 0.0.0.0
        # timeout for idle devices
        idleTimeout: 60000
```

### Authentication API now supports multiple authentication mechanisms

Our auth API now uses an array of authentication endpoints instead of a single one.

The following example is a user failing to authenticate (due to not being found on the system) and 
instead of failing getting an anonymous session (with limited data).

```yaml
auth:
  - type: file
    options:
      path: ./users.yml
  - type: none
```

For those developing/maintaining an auth endpoint please refer to the [updated guide](/tutorials/custom-plugins/authentication/)

### Permission API argument list has been shortened

The permission plugin API has been shortened since the name and data are all present on socketWrapper and easily found using typescript. Bonus is we now also can permission against clientData.

```ts
public canPerformAction(socketWrapper: SocketWrapper, message: Message, callback: PermissionCallback, passItOn: any): void {
  const { userId, clientData, serverData } = socketWrapper
}
```


