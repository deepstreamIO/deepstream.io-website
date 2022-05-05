---
title: Options
description: The options that the deepstream javascript client can be initialized with
---

Options are passed to the client upon initialisation

```javascript
const { DeepstreamClient } = require('@deepstream/client')
const client = deepstream( 'localhost:6020', {
  // custom deepstream options
  mergeStrategy: deepstream.LOCAL_WINS,
  subscriptionTimeout: 500,
})
```

You can finely tune deepstream to meet your specific requirements, including reconnection behaviour and granular timeouts.

## General Configuration

### mergeStrategy
A global merge strategy that is applied whenever two clients write to the same record at the same time. Can be overwritten on a per record level. Default merge strategies are exposed by the client constructor. It's also possible to write custom merge strategies as functions. You can find more on handling data conflicts [here](/docs/tutorials/core/datasync/handling-data-conflicts/)<br/>
_Type_: Function<br/>
_Default_: `MERGE_STRATEGIES.REMOTE_WINS`

### reconnectIntervalIncrement
Specifies the number of milliseconds by which the time until the next reconnection attempt will be incremented after every unsuccessful attempt.<br/>
E.g.for 1500: if the connection is lost,the client will attempt to reconnect immediately, if that fails it will try again after 1.5 seconds, if that fails it will try again after 3 seconds and so on...<br/>
_Type_: Number<br/>
_Default_: `4000`

### heartbeatInterval
The number of milliseconds to wait before sending a heartbeat. If two heatbeats are missed in a row the client will consider the server to have disconnected and will close the connection in order to establish a new one. <br/>
:::tip
If `client heartbeatInterval > 2 * server heartbeatInterval` the client will be considered as disconnnected by the server if no other messages are sent.<br/>
:::

_Type_: Number<br/>
_Default_: `30000`

### maxReconnectAttempts
The number of reconnection attempts until the client gives up and declares the connection closed.<br/>
_Type_: Number<br/>
_Default_: `5`

### subscriptionTimeout
The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/listening to a record or event before an error is thrown.<br/>
_Type_: Number<br/>
_Default_: `2000`

### recordReadAckTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no ack message has been received.<br/>
_Type_: Number<br/>
_Default_: `1000`

### recordReadTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no data has been received.<br/>
_Type_: Number<br/>
_Default_: `3000`

### recordDeleteTimeout
The number of milliseconds from the moment `record.delete()` is called until an error is thrown since no delete ack message has been received. Please take into account that the deletion is only complete after the record has been deleted from both cache and storage.<br/>
_Type_: Number<br/>
_Default_: `3000`

### recordDiscardTimeout
The number of milliseconds from the moment `record.discard()` is called until the record is definitely discarded. Take into account that this interval might lead to some inconsistencies and race conditions if not handled properly.<br/>
_Type_: Number<br/>
_Default_: `5000`

### offlineEnabled
Enable offline record support using indexdb to store data client side.
_Type_: Boolean<br/>
_Default_: `false`

### More

See all options in [source repo](https://github.com/deepstreamIO/deepstream.io-client-js/blob/master/src/client-options.ts) or access default options through the client:

```js
// Access default options
const { Options } = require('@deepstream/client')
```

