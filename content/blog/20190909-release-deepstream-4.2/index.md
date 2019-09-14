---
title: "Release: Deepstream 4.2" 
description: MQTT AND JSON Protocol support!
---

Two new connection endpoints have been added. They are currently experimental and will be properly
announced with associated documentation as part of the epic of updating all deepstream documentation.

The first endpoint is mqtt! This allows us to support mqtt auth (using username and password), retain using records and QoS 1 using write acks. The only issue is since mqtt only supports one sort
of concept (with flags distinguishing them) we bridge both events and records together. That means if you subscribe to 'weather/london', you'll get the update from both a client doing `event.emit('weather/london')` and `record.setData('weather/london')`.

So for example, using the following nodeJS mqtt code:

```js
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://localhost:1883', {
  // all this data will get forwarded to the HTTP webhook for normal
  // deepstream authentication and permission workflows
  username: 'my-device-name',
  password: 'my-device-password',
  properties: {
    authenticationMethod: 'a-custom-authentication-method',
    authenticationData: JSON.stringify({ property: "another value" })
  }
})
 
client.on('connect', function () {
    if (!err) {
      setInterval(() => {
        client.publish('weather/london', 
            JSON.stringify({  temperature: 12 }), 
            { 
                // This tells deepstream it's a record, which will save it in the database
                retain: true, 
                // This tells deepstream it's a write ack, so will get a confirmation
                qos: 1 
            }, 
            console.log
        )
      }, 1000)
    }
  })

  // Lets add a kill switch for fun
  client.subscribe('stop-subscribing', function (err) {
      console.log('subscribed to the kill switch')
  })
})
 
client.on('message', function (topic, message) {
    if ('stop-subscribing') {
        client.end()
    }
})
```

You can listen in on the events using a normal deepstream client:

```js
const deepstream = require('@deepstream/client')
const client = deepstream('localhost:6020')
await client.login({
    username: 'my-username',
    password: 'my-user-password',
})
const room = client.record.getRecord('weather/london')
await room.whenReady()
room.susbcribe(console.log)

setTimeout(() => {
    client.event.emit('stop-subscribing')
}, 5000)
```

The second endpoint is `ws-json` which allows users to interact with deepstream by just passing through json serialized text blobs instead of protobuf. This is mainly to help a few people trying to write SDKs without the hassle of a protobuf layer.

A small hidden feature, Valve also injects a `name` variable which allows you to reference the name your currently in. Useful for cross referencing a record and pulling out the variable from the topic at the same time.

```yaml
record:
    '$modelName/$id':
        read: _(name).owner === $id
```

### Fix

Subscription registry seemed to have a massive leak when it came to dead sockets! This has now been fixed. The sockets seemed to have gotten the remove event deleted earlier in their lifecycle which prohibited it from doing a proper clean up later. 