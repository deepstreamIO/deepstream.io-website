---
title: Configuration
description: The available configuration options to customise deepstream
---

You can make any configuration changes you need for your deepstream setup in the
*config.yml* file. Depending on the installation sources, the configuration can
be found in
- `/etc/deepstream/` if you installed on Linux with APT or yum,
- in the folder `conf` in the Node.js module directory if you installed with
  `npm`, or
- in the folder `conf` after unpacking the standalone server binary.

## General Configuration

In this section you can change general settings for each server in a cluster.

```yaml
# general configuration with default values
serverName: UUID
showLogo: true
```

### serverName
Every server in a cluster of servers needs a unique name. You can add your own or set it to `UUID` to let deepstream auto-generate a unique ID.<br>
_Default_: `UUID`

### showLogo
When starting, a server can show the deepstream logo. This setting is best left enabled.<br>
_Default_: `true`


## SSL Configuration

deepstream can be configured to encrypt connections and you can provide the
paths to your SSL key, certificate, and certificate authority file.

{{#infobox "info"}}
- For performance reasons, we recommend leaving SSL termination to a load
balancer, e.g., nginx or HAProxy. The [nginx integration
tutorial](/tutorials/integrations/other-nginx/) describes this in detail.
{{/infobox}}

```yaml
# SSL default configuration (no SSL/TLS)
sslKey: null
sslCert: null
sslCa: null
```

### sslKey
The path to your SSL key file.<br>
_Default_: `null`

### sslCert
The path to your SSL certificate file.<br>
_Default_: `null`

### sslCa
The path to your SSL certificate authority file.<br>
_Default_: `null`


## Connection Endpoint Configuration

Deepstream (v2.3.0 and later) can be configured with custom connection endpoints. A (locally
unique) identifier, typically the transport type, is listed below the `connectionEndpoints` key
e.g. 'tcp'. Below that, either a path to the endpoint or a name is listed. Endpoint options can
also be specified. 
```yaml
connectionEndpoints:
  websocket:
    name: uws
    options:
      port: 6020
      host: 0.0.0.0
```

The special 'uws'(µWebSockets) endpoint configures the built-in endpoint. To avoid starting it,
null the 'websocket' key as follows:
```uws
  websocket: null
```

### µWebSockets
The uws endpoint has the following options:

#### port
Sets the port for the HTTP healthcheck and Websocket server.<br>
_Default_: `6020`

#### host
Sets the host for the HTTP healthcheck and Websocket server.<br>
_Default_: `0.0.0.0`

#### urlPath
Sets which URL path Websocket connections should connect to.<br>
_Default_: `/deepstream`

#### healthCheckPath
URL path for HTTP health-checks, GET requests to this path will return 200 if deepstream is alive.
<br>
_Default_: `/health-check`

#### heartbeatInterval
The number of milliseconds between each ping/heartbeat message. <br>
_Default_: `30000`

#### unauthenticatedClientTimeout
The amount of time a connection can remain open while not being logged in. <br>
_Default_: `180000`

#### maxAuthAttempts
Invalid login attempts before the connection is cut. <br>
_Default_: `3`

#### logInvalidAuthData
Controls whether logs should contain the cleartext usernames and passwords of invalid login
attempts.<br>
_Default_: false

#### maxMessageSize
Sets the maximum message size allowed to be sent to the server (in bytes).<br>
_Default_: `1048576`

### outgoingBufferTimeout
The amount of milliseconds that secondary writes to sockets are buffered. This means
writes that are not realtime critical, which currently are either ACKs or 
non critical ERROR messages.<br>
_Default_: `0`

## Plugin Configuration

You can extend deepstream with plugins for connectors to other services, these
are for logging, storage engines, caching layers, and message systems. To enable
a plugin, uncomment the relevant category key underneath the `plugins` key. Each
plugin type has a path or name, and a set of options.

```yaml
# Plugin example using redis
plugins:
  message:
    name: redis
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
leave color markers in log files if you redirect the output into a file.<br>
_Default_: `true`

### logLevel
Sets at what level and above the server should log messages. Valid levels are `DEBUG`, `INFO`,
`WARN`, `ERROR`, and `OFF`.<br>
_Default_: `INFO`


## Storage Options

### storageExclusion
A regular expression that - if it matches a recordname - will prevent the record from being stored
in the database.<br>
_Default_: `null`

### storageHotPathPatterns
A list of prefixes that designate a record for direct writes to storage. 
When a correctly permissioned matching record is updated via `setData()`, it will be written
directly to the cache and storage without a record transition. This can be up to twice as fast as
updating a normal record using `setData()`<br>
_Default_: `[]`


## Authentication

In this section you can configure the authentication type the server uses.

You set the authentication type as a subkey the `auth` key. The available
authentication options are `none`, `file`, and `http`, each of them having
different `options` which are described in the tutorials on [Auth
None](/tutorials/core/auth-none/), [file-based
authentication](/tutorials/core/auth-file/), and [HTTP
authentication](/tutorials/core/auth-http-webhook/), respectively.

```yaml
#Authentication
auth:
  type: none
  options: depends
```

_Default_: `none`


## Permissioning

In this section you can configure the
[permissioning](/tutorials/core/permission-conf-simple/). The key used for this
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
The deepstream permissions model allows for some complex nested actions and queries. To prevent a performance hit you can limit the nesting level with this option.<br>
_Default_: `3`

### cacheEvacuationInterval
The results of permission checks are cached to improve performance. Use this setting to change the time interval (in milliseconds) that the cache is regenerated.<br>
_Default_: `60000`

## Timeouts (in milliseconds)

In this section you can configure timeout values for a variety of network calls.

```yaml
# Default timeout values
rpcAckTimeout: 1000
rpcTimeout: 10000
cacheRetrievalTimeout: 1000
storageRetrievalTimeout: 2000
dependencyInitialisationTimeout: 2000
```

### rpcAckTimeout
Sets how long deepstream will wait for a RPC provider to acknowledge receipt of a request.<br>
_Default_:`1000`

### rpcTimeout
Sets how long deepstream will wait for RPCs to complete.<br>
_Default_:`10000`

### cacheRetrievalTimeout
Sets how long deepstream will wait when retrieving values from the cache.<br>
_Default_:`1000`

### storageRetrievalTimeout
Sets how long deepstream will wait when retrieving values from the database.<br>
_Default_:`2000`

### dependencyInitialisationTimeout
Sets how long deepstream will wait for dependencies to initialize.<br>
_Default_:`2000`
