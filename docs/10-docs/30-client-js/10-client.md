---
title: Javascript Client
description: The entry point API documentation for the deepstream.io js client
---

The deepstream JavaScript client can be used by both browsers and Node.js. You can get it via NPM or Bower as `@deepstream/client` or browse the source on [Github](https://github.com/deepstreamIO/deepstream.io-client-js)

### deepstream(url, options)

|Argument|Type|Optional|Description|
|---|---|---|---|
|url|String|false|The server URL
|options|Object|true|A map of options. Please find a list of available options [here](/docs/client-js/options/)

Creates a client instance and initialises the connection to the deepstream server. The connection will be kept in a quarantine state and won't be fully usable until `login()` is called.

```javascript
const { DeepstreamClient } = require('@deepstream/client')
const client = new DeepstreamClient('localhost:6020')
client.login()
```

## Events

### connectionStateChanged
Emitted every time the connectionstate changes. The connectionState is passed to the callback and can also be retrieved using <a href="#getConnectionState()">getConnectionState()</a>. A list of possible connection states is available [here](/tutorials/concepts/connectivity/#connection-states)

### error
Aggregates all errors that are encountered. Some errors like `CONNECTION_ERROR` or `MESSAGE_PARSE_ERROR` are exlusively emitted by the client.
Others like `ACK_TIMEOUT` or `VERSION_EXISTS` that relate to a specific Record, Event or RPC are emitted first by the object they relate to and are then forwarded to the client. You can find a list of all errors [here](/docs/common/errors/).

```javascript
client.on('error', ( error, event, topic ) =>
  console.log(error, event, topic);
)
```

## Methods

### login(authParams, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|authParams|Object|false|An object with authentication parameters
|callback|Function|true|A function that will be called once the response to the authentication request is received.

Authenticates the client against the server. To learn more about how authentication works, please have a look at the [Security Overview](/tutorials/concepts/security/).

Callback will be called with: success (Boolean), data (Object).

```javascript
const { DeepstreamClient } = require('@deepstream/client')
const client = new DeepstreamClient('localhost:6020')
// client.getConnectionState() will now return 'AWAITING_AUTHENTICATION'

client.login({username: 'peter', password: 'sesame'}, (success, data) => {
  if (success) {
    // start application
    // client.getConnectionState() will now return 'OPEN'
  } else {
    // extra data can be optionaly sent from deepstream for
    // both successful and unsuccesful logins
    alert(data)

    // client.getConnectionState() will now return
    // 'AWAITING_AUTHENTICATION' or 'CLOSED'
    // if the maximum number of authentication
    // attempts has been exceeded.
  }
})

// client.getConnectionState() will now return 'AUTHENTICATING'
```

### close()
Closes the connection to the server. Using this method will prevent the client from reconnecting and authenticating again with the same instance of the client. More info [here](/tutorials/concepts/connectivity/#closed-client-connection)

```javascript
client.on('connectionStateChanged', connectionState => {
  // will be called with 'CLOSED' once the connection is successfully closed.
})

client.close()
```

### pause()
Pauses the connection to the server and enters in `OFFLINE` state.

```javascript
client.on('connectionStateChanged', connectionState => {
  // will be called with 'OFFLINE' once the connection is successfully paused.
})

client.pause()
```

### resume()
|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|true|A function that will be called with the result of the reconnection attempt.

Restores the connection to the server after a `pause()` call.

```javascript
client.on('connectionStateChanged', connectionState => {
  // will be called with 'RECONNECTING' and the subsequent intermediate connection states
})

client.resume()
```

### getConnectionState()
Returns the current connectionState. Please find a list of available connectionStates [here](/tutorials/concepts/connectivity/index.html#connection-states).

### getUid()
Returnes a unique id. The uid starts with a Base64 encoded timestamp to allow for semi-sequentual ordering and ends with a random string.

```javascript
client.getUid() // 'i9i6db5q-1xak1s2sfzk'
```
