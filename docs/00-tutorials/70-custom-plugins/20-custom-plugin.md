---
title: Building your own custom plugin
---

Learn how to create a custom plugin, used to hook into services and provide random functionality!

The repo for all examples is [here](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/custom-plugin)

### Configuring the plugin

There are tree ways to configure custom plugins depending on how you choose to set your deepstream server options.

1) Via config.yml:

```yaml
plugins:
  custom:
    path: './custom-plugin/custom-plugin'
```

2) Via deepstream constructor:

```js
import { Deepstream } from '@deepstream/server'

export const deepstream = new Deepstream({
    plugins: {
        custom: {
            path: './custom-plugin/custom-plugin',
            options: {
                requiredProperty: 'exists'
            }
        }
    }
})

deepstream.start()
```

3) Via deepstream setter:

```js
import { Deepstream } from '@deepstream/server'
import CustomPlugin from './custom-plugin'

const deepstream = new Deepstream({})

deepstream.set('plugins', {
    custom: new CustomPlugin({
        requiredProperty: 'string'
    }, deepstream.getServices())
})

deepstream.start()
```

### Building custom plugins

Please check the example plugins repo for more examples on how to build your own custom plugins for the main services. Remember to cjeck the server source code for the actual implementations of the core plugins.

- [Authentication](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/auth): Learn how to create an authentication plugin to verify a users ability to connect, as well as provide data that can be used for permissioning further on.

- [Permission](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/permission): Learn the basics of creating a permission plugin, allowing you to allow or deny actions down to a per message basis.

- [Logger](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/logger): Create your own logger to interact with your favorite logging platform or filter logs to what you want exactly.

- [Storage](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/storage): Create a plugin to connect to any type of storage system out there, be it file, memory, disk, a url or anything else.

- [Cache](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/cache):Create a plugin to connect to any type of cache system out there, just remember to keep it fast!

- [Cluster Node](https://github.com/deepstreamIO/deepstream.io/blob/master/src/services/cluster-node/vertical-cluster-node.ts): Create a plugin that allows deepstream nodes to connect to each other and scale. Example taken from main repo.

- [Monitoring](https://github.com/deepstreamIO/deepstream.io-example-plugins/tree/master/src/monitoring): Create a plugin that monitors deepstream nodes, incoming and outgoing messages, users, anything you need.



### Example Documented Plugin

```js
import { TOPIC, EVENT_ACTION } from '@deepstream/protobuf/dist/types/all'
import { DeepstreamPlugin, ConnectionListener, DeepstreamServices, SocketWrapper, EVENT } from '@deepstream/types'

// The options your plugin can expect
interface CustomPluginOptions {
    requiredProperty: string
}

/**
 * This plugin will log the handshake data on login/logout and send a custom event to the logged-in
 * client.
 */
export default class CustomPlugin extends DeepstreamPlugin implements ConnectionListener {
    // This will be shown in deepstream startup logs, recommended to insert version
    public description = 'My Custom Plugin'
    // This will create a thing wrapper around the default logger with the CUSTOM_PLUGIN namespace
    private logger = this.services.logger.getNameSpace('CUSTOM_PLUGIN')

    // You need the constructor to access the plugin options and services. Please note that when creating
    // your own plugin via NodeJS and not via the config file you'll need to call the constructor yourself,
    // but I would recommend sticking to this API!
    constructor (private options: CustomPluginOptions, private services: Readonly<DeepstreamServices>) {
        super()
    }

    /**
     * An optional API to avoid implementing things inside of the constructor. Best place to access deepstream services.
     */
    public init () {
        if (typeof this.options.requiredProperty !== 'string') {
            // This will inform deepstream a fatal error occured and will shutdown the server. This can be triggered at
            // any point of the plugin lifetime, and is useful for informing deepstream a unrecoverable event occured like
            // losing the connection to a cache or database
            this.logger.fatal(EVENT.ERROR, 'Invalid or missing "requiredProperty"')
        }
    }

    /**
     * This is actually in the super class (DeepstreamPlugin) and if your plugin is sync doesn't need to be implemented.
     * If your plugin is async you need to make sure this only returns when its complete. To make the point clear I made
     * it async by just putting in a timeout. This is used to ensure the connection to a database or startup of a server
     * is complete before deepstream launched.
     */
    public async whenReady (): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 1000))
    }

    /**
     * Same as whenReady, except on deepstream shutdown instead of startup.
     */
    public async close (): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 1000))
    }

    /**
     * This is called when client is authenticated with a SocketWrapper. This is a powerful little wrapper
     * that abstracts away all the IO calls and allows you to interact directly via the socket regardless
     * of the underlying implementation. Please note that this is only called after a client is authenticated!
     * Unauthenticated clients don't leave the scope of the connection-endpoint in order to minimize logic.
     *
     * This call also has to be supported by the connection-endpoint. For example we don't consider a HTTP
     * request authenticated request to count as an actual client, so this will only be called via websockets.
     */
    public onClientConnected (socketWrapper: SocketWrapper): void {
        // Note we are using the namespaced logger instead of the one on `this.services.logger`
        this.logger.info(EVENT.INFO, `User logged in with handshake data: ${JSON.stringify(socketWrapper.getHandshakeData())}`)

        // This is a cheeky/advanced example of how you can use the SocketWrapper to directly send messages. As
        // users needs progress we will instead be creating official hooks going forward.
        socketWrapper.sendMessage({
            topic: TOPIC.EVENT,
            action: EVENT_ACTION.EMIT,
            name: 'user-connected',
            parsedData: {
                how: 'Due to events nature, you can pretty much emit them without any issues!'
            }
        })
    }

    /**
     * This is called when an authenticated client disconnects
     */
    public onClientDisconnected (socketWrapper: SocketWrapper): void {
        this.logger.info(EVENT.INFO, `User logged in with handshake data: ${JSON.stringify(socketWrapper.getHandshakeData())}`)
    }
}
```

