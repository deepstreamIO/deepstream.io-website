---
title: Configuration
description: The available configuration options to customize deepstream
---

You can make any configuration changes you need for your deepstream setup in the
*config.yml* file. Depending on the installation sources, the configuration can
be found in
- in the folder `conf` in the Node.js module directory if you installed with
  `npm`, or
- in the folder `conf` after unpacking the standalone server binary.

## General Configuration

In this section you can change general settings for each server in a cluster.

```yaml
# general configuration with default values
serverName: UUID
showLogo: true
dependencyInitializationTimeout: 2000
exitOnFatalError: false
```

### serverName
Every server in a cluster of servers needs a unique name. You can add your own or set it to `UUID` to let deepstream auto-generate a unique ID.

_Default_: `UUID`

### showLogo
When starting, a server can show the deepstream logo. This setting is best left enabled.

_Default_: `true`

### logLevel
The logLevel to use across the application

_Default_: INFO

### dependencyInitializationTimeout
Sets how long deepstream will wait for dependencies to initialize.

_Default_:`2000`

### libDir
The directory where all the plugins reside, this is used in standalone binaries

_Default_: None, it assumes all plugins are installed via npm

### exitOnFatalError
Exit if a fatal error occurs

_Default_: false

## RPC Configuration

### ackTimeout
Sets how long deepstream will wait for a RPC provider to acknowledge receipt of a request.

_Default_:`1000`

### responseTimeout
Sets how long deepstream will wait for RPCs to complete.

_Default_:`10000`

## Record Configuration

### cacheRetrievalTimeout
Sets how long deepstream will wait when retrieving values from the cache.

_Default_:`1000`

### storageRetrievalTimeout
Sets how long deepstream will wait when retrieving values from the database.

_Default_:`2000`

### storageExclusionPrefixes
A list of prefixes that, when a record starts with one of the prefixes the 
records data won't be stored in the db

_Default_: `[]`

### storageHotPathPrefixes
A list of prefixes that designate a record for direct writes to storage. 
When a correctly permissioned matching record is updated via `setData()`, it will be written
directly to the cache and storage without a record transition. This can be up to twice as fast as
updating a normal record using `setData()`

_Default_: `[]`

## Listening

### shuffleProviders
Try finding a provider randomly rather than by the order they subscribed to.

_Default_: true

### responseTimeout
The amount of time to wait for a provider to acknowledge or reject a listen request

_Default_: 500

### rematchInterval
The amount of time before trying to reattempt finding matches for subscriptions. This
is not a cheap operation so it's recommended to raise keep this at minutes rather then
second intervals if you are experiencing heavy loads

_Default_: 60000

### matchCooldown
The amount of time a server will refuse to retry finding a subscriber after a previously
failed attempt. This is used to avoid servers constantly trying to find a match without a
cooldown period

_Default_: 10000

## Connection Endpoint Configuration

Deepstream (v2.3.0 and later) can be configured with custom connection endpoints. You can supply as many as you want, each as any individual 
list entry below the `connectionEndpoints` key. Just make sure the ports don't clash!

```yaml
connectionEndpoints:
  -
    name: uws
    options:
      port: 6020
      host: 0.0.0.0
```

The special types 'uws-websocket', 'ws-websocket' and 'node-http' endpoint configures the built-in endpoints

### Websockets

The websocket endpoints share the following options:

#### urlPath
Sets which URL path Websocket connections should connect to.

_Default_: `/deepstream`

#### heartbeatInterval
The number of milliseconds between each ping/heartbeat message. 

_Default_: `30000`

#### unauthenticatedClientTimeout
The amount of time a connection can remain open while not being logged in. 

_Default_: `180000`

#### maxAuthAttempts
Invalid login attempts before the connection is cut. 

_Default_: `3`

#### logInvalidAuthData
Controls whether logs should contain the cleartext usernames and passwords of invalid login
attempts.

_Default_: false

#### maxMessageSize
Sets the maximum message size allowed to be sent to the server (in bytes).

_Default_: `1048576`

### outgoingBufferTimeout
The amount of milliseconds that secondary writes to sockets are buffered. This means
writes that are not realtime critical, which currently are either ACKs or 
non critical ERROR messages.

_Default_: `0`

## Custom Plugin Configuration

You can extend deepstream with plugins for connectors to other services, these
are for logging, storage engines, caching layers, and message systems. To enable
a plugin, uncomment the relevant category key underneath the `plugins` key. Each
plugin type has a path or name, and a set of options.

```yaml
# Plugin example using redis
plugins:
  myCustomPlugin:
    path: ./my-custom-plugin
    options:
       host: localhost
       port: 5672
```

### path
Set a path to a JavaScript file, node module or a folder with an _index.js_ file which exports a constructor.

### name
If you are using any of the official deepstream connectors, add the name of what the plugin connects to here, for example `redis`.

**Note**: You can set `path` **or** name, but not both.

### options
Under this key, add sub key/value pairs to set the configuration options that are passed to the plugin. Each plugin should mention what configuration options you can set.

## Logger

deepstream uses by default a logger which prints out to _stdout_ (errors and warnings to _stderr_). You can set these options for the default logger by using the same configuration style for the plugins:

```yaml
logger:
  name: default
  options:
    colors: true
    logLevel: INFO
```

### colors
Sets whether the server's logs should output in color. This will look great in a console, but will
leave color markers in log files if you redirect the output into a file.

_Default_: `true`

### logLevel
Sets at what level and above the server should log messages. Valid levels are `DEBUG`, `INFO`,
`WARN`, `ERROR`, and `OFF`.

_Default_: `INFO`


## Authentication

In this section you can configure the authentication types the server uses.

You set the authentication type as a subkey the `auth` key. The available
authentication options are `none`, `file`, `storage` and `http`, each of them having
different `options` which are described in the tutorials on [Auth
None](/tutorials/core/auth-none/), [file-based
authentication](/tutorials/core/auth-file/), [storage-based
authentication](/tutorials/core/auth-storae/), and [HTTP
authentication](/tutorials/core/auth/http-webhook/), respectively.

```yaml
#Authentication
auth:
  - type: none
```

_Default_: `none`

## Permissioning

In this section you can configure the
[permissioning](/tutorials/core/permission/conf-simple/). The key used for this
section is `permission` and you can create your own custom permission handler or
use a configuration file. To use the former method, select the option
`type: none` and override the `permissionHandler` with the aid of the [NodeJS
server API](/docs/server/node-api/). To use the latter method, set `type: config` and modify the `option` values below.

```yaml
# Permissioning example with default values for config-based permissioning
permission:
  type: config
  options:
    path: ./permissions.yml
    maxRuleIterations: 3
    cacheEvacuationInterval: 60000
```

### path
Set the path to the file that declares permissions. This option is **mandatory**
with `type: config`. The file can be in JSON, JavaScript, or YAML format. By
default, deepstream ships with a `permissions.yml` permitting every action.

### maxRuleIterations
The deepstream permissions model allows for some complex nested actions and queries. To prevent a performance hit you can limit the nesting level with this option.

_Default_: `3`

### cacheEvacuationInterval
The results of permission checks are cached to improve performance. Use this setting to change the time interval (in milliseconds) that the cache is regenerated.

_Default_: `60000`

## Storage and Cache

Storage and Cache plugins can be configured as follows, please look at [current connectors](/tutorials/#connectors/) for in depth tutorials how to configure them.

```yaml
cache:
  name: redis
  options:
    host: localhost
    port: 6379

storage:
  name: postgres
  options:
    user: postgres
    database: postgres
    password: mysecretpassword
    host: 'localhost'
    port: 5432
```
