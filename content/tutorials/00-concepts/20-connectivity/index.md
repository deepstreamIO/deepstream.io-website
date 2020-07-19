---
title: Connectivity
description: Documentation for connection status and how to configure reconnection behaviour
---

All deepstream SDKs establish a persistent, bidirectional connection to the platform. This connection can be lost due to network outage, lack of mobile network coverage or similar problems – if this happens all SDKs will queue outgoing updates and try to re-establish the connection.

##  Reconnection behaviour
If a connection is lost, the client will immediately attempt to reconnect. Should that fail, it will wait a certain time and retry. Upon every unsuccessful attempt it will increment the time until the next attempt is made by a number of milliseconds specified in `reconnectIntervalIncrement`. For example if this is set to `2000` the first reconnection attempt will be made immediately, the second after two seconds, the next four seconds after that and so on. You can specify an upper limit to this as `maxReconnectInterval`. After a number of unsuccessful attempts configurable as `maxReconnectAttempts` the client will give up and change the connection-state to `ERROR`.

## Heartbeats
Even if your connection is established, messages might not arrive. To check this, clients continuously send small ping-messages to the platform to make sure it’s still reachable. If the client misses two consecutive responses it will change the connection-state to `ERROR` regardless of connectivity. You can configure how frequently these heartbeat messages are sent via `heartbeatInterval` (every 30 seconds by default).

## Connection States
Each SDK provides the current connection-state as well as a way to listen for changes.

__Connected__

### OPEN
The connection is established; everything is fine.

__Not Connected__

### RECONNECTING
The connection was lost to server. The client makes reconnection attempts.

### CLOSED
The connection was deliberately closed by the user via `client.close()`. No reconnection attempts will be made. The client also starts in this state, but almost immediatly switches to `AWAITING_CONNECTION`.

### ERROR
The connection is finally declared unrecoverable, e.g. as a result from too many failed reconnection attempts or missed heartbeats. No further reconnection attempts will be made.

__Intermediate States__

### AWAITING_CONNECTION
The client has established the physical connection and waits for the initial response from the server.

### CHALLENGING
The client is currently undergoing a negotiation sequence that might result in a redirect or exchange of configuration.

### AWAITING_AUTHENTICATION
State after the client was initialised, but before `.login()` was called.

### AUTHENTICATING
State after `.login()` was called, but before the response from the platform is received.

## An Example

```javascript
const options = {
    // Reconnect after 10, 20 and 30 seconds
    reconnectIntervalIncrement: 10000,
    // Try reconnecting every thirty seconds
    maxReconnectInterval: 30000,
    // We never want to stop trying to reconnect
    maxReconnectAttempts: Infinity,
    // Send heartbeats only once a minute
    heartbeatInterval: 60000
};

const client = new DeepstreamClient('<url>', options)
client.login()

// Assume we're updating a green/yellow/red indicator for connectionState with jQuery
const connectionStateIndicator = $('#connection-state-indicator');
client.on('connectionStateChanged', connectionState => {
    connectionStateIndicator.removeClass('good neutral bad')
    switch (connectionState) {
        case 'OPEN':
            connectionStateIndicator.addClass('good')
            break
        case 'CLOSED':
        case 'ERROR':
            connectionStateIndicator.addClass('bad')
            break
        default:
            connectionStateIndicator.addClass('neutral')
    }
})
```

## Closed client connection  

Once the client closes the connection to the server, it can not be opened again using the same instance of the client. This can cause some issues on web/mobile when we logout a user, and close it's deepstream client connection, and then try to login as a new user. It will not be possible using the same instance of the client. One solution is to use the [singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern), as shown in this quick example:  

```javascript

// Deepstream client using "singleton" pattern
let client = null

const dsClient = () => {
  if (!client) {
    client = new DeepstreamClient('<url>', options)
  }
  if (client && client.getConnectionState() === 'CLOSED') {
    client = new DeepstreamClient('<url>', options)
  }
  return client
}
```

Then pass along and call the dsClient function for interacting with the client methods:  
 `dsClient().login()`  
  `dsClient().record.getRecord(recordName)`  

Using this pattern, if the client connection is closed, a new one will be instantiated and returned.  
