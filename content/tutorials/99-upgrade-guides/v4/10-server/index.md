---
title: Upgrading the server
description: Upgrading the deepstream server to V4
---

The deepstream server has changed significantly under the hood, however for almost all users the main breaking change is the configuration structure.

Before we followed a structure that tried to keep everything on the root level, which is very useful for overriding things via
node but as features grow becomes significantly messier. It also had some issues with not being able to provide a dynamic amount of connection-endpoints easily or add custom plugins.

### Old Config

```yaml
showLogo: true
logLevel: INFO
#libDir: ../lib

# SSL Configuration
sslKey: null
sslCert: null
sslCa: null

# Connection Endpoint Configuration
# to disable, replace configuration with null eg. `http: null`
connectionEndpoints:
  websocket:
    name: uws
    options:
        ...

  http:
    name: http
    options:
        ...

logger:
  name: default
   options:
     colors: true
     logLevel: INFO

plugins:
  cache:
  name: redis
    options:
      host: ${REDIS_HOST}
      port: 6379

  storage:
    name: rethinkdb
    options:
      host: localhost
      port: 28015

storageExclusion: null

auth:
  type: none

permission:
  type: config
  options:
    ...

rpcAckTimeout: 1000
rpcTimeout: 10000
cacheRetrievalTimeout: 1000
storageRetrievalTimeout: 2000
dependencyInitialisationTimeout: 2000
listenResponseTimeout: 500
lockTimeout: 1000
lockRequestTimeout: 1000
broadcastTimeout: 0
# storageHotPathPatterns:
  # - analytics/
  # - metrics/
```

### New Config

The new config has the following main changes:

### Feature Subsections

These contain all the timeouts associated to each specific feature:

- rpc
- record
- listen

### Services

Required services such as storage, cache and others are now on the root level

### Connection Endpoint

Is now an array and not a map, as you may want more than one websocket / http connector 
instead of nulling them down

```yaml
connectionEndpoints:
  - type: ws-websocket
    options:
        ...

  - type: node-http
    options:
        ...
```

### Plugins

Is now where you insert your custom plugins. This is a map with a plugin name, the path to the 
plugin entry point and options.

This follows a map approach since we never ship with default plugins and so we don't have any merge
conflicts or negating aspects to take into consideration

```yaml
plugins:
  plugin1:
    path: 'path-to-js-file / module'
    options:
      ...  
  plugin2:
    path: 'path-to-js-file / module'
    options:
      ...
```

### Pattern to prefixes

We have changed `storageHotPathPatterns` to `storageHotPathPrefixes` as it is easier to use.
This means you have provide a list of prefixes instead of regex patterns.

```yaml
storageHotPathPrefixes:
    - analytics/
    - metrics/
```

### SSL demotion

The SSL properties are now on meant to be on each endpoint instead of the root config object, 
as different libraries use different approaches. However SSL support in deepstream v4 is not 
yet fully implemented! This is mainly because we heavily advise not using deepstream with SSL
in production systems and instead run it behind an SSL termination endpoint.

### Websockets

We not have two websocket providers, uws and ws. The reason we introduced ws is because uws
doesn't support vertical clustering, and occasionally results in odd stack traces. So although
the performance of uWebsocket.js is meant to be significantly faster we leave the choice up to 
you.

Also, we have removed the `broadcastTimeout`. This is actually a big step backwards for us in
regards to broadcast performance and we will be looking to reintroduce it again in the future. 
However the logic did result in quite a few notorious bugs due to its async nature and since we
no longer use text based messages the advantage is a little less than obvious. Keep tuned for updates!

###  Config

```yaml
serverName: UUID
showLogo: true
logLevel: INFO
dependencyInitialisationTimeout: 2000
#libDir: ../lib

rpc:
  ackTimeout: 1000
  responseTimeout: 10000

record:
  cacheRetrievalTimeout: 30000
  storageRetrievalTimeout: 30000
  # storageExclusionPrefixes:
  #   - no-storage/
  #   - temporary-data/
  # storageHotPathPrefixes:
  #   - analytics/
  #   - metrics/

listen:
  shuffleProviders: true
  responseTimeout: 500
  rematchInterval: 60000
  matchCooldown: 10000

# Connection Endpoint Configuration
# to disable, replace configuration with null eg. `http: null`
connectionEndpoints:
  - type: ws-websocket
    options:
        ...

  - type: node-http
    options:
        ...

  # - type: uws-websocket
  #   options:
  #      ...

# Logger Configuration
logger:
  type: default
  options:
    ...
    
cache:
  name: redis
  options:
    host: localhost
    port: 6379

storage:
  name: rethinkdb
  options:
    host: localhost
    port: 28015

auth:
  type: none

permission:
  type: config
  options:
    ...
```

### New Plugin API

Old plugins followed the following API:

```javascript
class Plugin extends Emitter {
    constructor (options) {
        this.isReady = false
    }
    
    // Called at some point by your plugin login
    _ready () {
        this.isReady = true
        this.emit('ready')
    }

    // How you throw an error
    _error (e) {
        this.emit('error', e)
    }
}
```

New Plugins have this following API

```javascript
class Plugin {
    /**
    * @param {PluginOptions} pluginOptions 
    * @param {DeepstreamServices} services 
    * @param {DeepstreamConfig} config 
    */
    constructor (pluginOptions, services, config) {
        // returns a logger that is scoped to this plugin, your logger plugin
        // can then pick colors or prefixes for each namespace
        this.logger = this.services.logger.getNamespace('PLUGIN')
    }
    
    async whenReady () {
        // return when plugin is loaded
    }

    async close () {
        // return when plugin is shutdown successfully
    }

    // How you throw an error
    _error (e) {
        // This isn't fatal, just logs
        this.logger.error('Error')

        // If you want to exit DS
        this.logger.fatal('Error')
    }
}
```

### New Storage/Cache API

The storage and cache API has changed in order to improve performance and ease of use.

Please look at the [storage](/tutorials/custom-plugins/storage/) and [cache](/tutorials/custom-plugins/cache/) tutorials to see what the new API looks like.


### New Permission API

For those of you that implemented a plugin, there have been changes to the callback in permissions. This is to stop us
from having to bind functions in the codebase which gives us a nice little performance boost!

### Old callback

```javascript
canPerformAction (id, message, callback, authData) {
callback(null, true)
}
```

# New callback

```javascript
canPerformAction (id, message, callback, authData, socketWrapper, passItOn) {
    callback(socketWrapper, message, passItOn, null, true)
}
```

### No Linux Distro Support

This was a difficult choice, but we have decided to drop installs via linux flavours. This is because 
the package types didn't resonate correctly and complicated the build for very few installs.

Instead you can just download the latest version from github and install the service using

```
./deepstream service add --name name-of-service --config /path/to/conf/directory/
```