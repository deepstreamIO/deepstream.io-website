---
title: Options
description: The options that the deepstream javascript client can be initialized with
---

Options are passed to the client upon initialisation

```javascript
const deepstream = require('deepstream.io-client-js')
const client = deepstream( 'localhost:6020', {
  // custom deepstream options
  mergeStrategy: deepstream.LOCAL_WINS,
  subscriptionTimeout: 500,
})
```

You can finely tune deepstream to meet your specific requirements, including reconnection behaviour and granular timeouts.

## General Configuration

### mergeStrategy
A global merge strategy that is applied whenever two clients write to the same record at the same time. Can be overwritten on a per record level. Default merge strategies are exposed by the client constructor. It's also possible to write custom merge strategies as functions. You can find more on handling data conflicts [here](/tutorials/core/handling-data-conflicts/)<br>
_Type_: Function<br>
_Default_: `MERGE_STRATEGIES.REMOTE_WINS`

### reconnectIntervalIncrement
Specifies the number of milliseconds by which the time until the next reconnection attempt will be incremented after every unsuccessful attempt.<br>
E.g.for 1500: if the connection is lost,the client will attempt to reconnect immediately, if that fails it will try again after 1.5 seconds, if that fails it will try again after 3 seconds and so on...<br>
_Type_: Number<br>
_Default_: `4000`

### maxReconnectAttempts
The number of reconnection attempts until the client gives up and declares the connection closed.<br>
_Type_: Number<br>
_Default_: `5`

### rpcAckTimeout
The number of milliseconds after which a RPC will error if no ack message has been received.<br>
_Type_: Number<br>
_Default_: `6000`

### rpcResponseTimeout
The number of milliseconds after which a RPC will error if no response-message has been received.<br>
_Type_: Number<br>
_Default_: `10000`

### subscriptionTimeout
The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/listening to a record or event before an error is thrown.<br>
_Type_: Number<br>
_Default_: `2000`

### maxMessagesPerPacket
If your app sends a large number of messages in quick succession, the deepstream client will try to split them into smaller packets and send these every <timeBetweenSendingQueuedPackages>ms. This parameter specifies the number of messages after which deepstream sends the packet and queues the remaining messages. Set to `Infinity` to turn the feature off.<br>
_Type_: Number<br>
_Default_: `100`

### timeBetweenSendingQueuedPackages
Please see description for maxMessagesPerPacket. Sets the time in ms.<br>
_Type_: Number<br>
_Default_: `16`

### recordReadAckTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no ack message has been received.<br>
_Type_: Number<br>
_Default_: `1000`

### recordReadTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no data has been received.<br>
_Type_: Number<br>
_Default_: `3000`

### recordDeleteTimeout
The number of milliseconds from the moment `record.delete()` is called until an error is thrown since no delete ack message has been received. Please take into account that the deletion is only complete after the record has been deleted from both cache and storage.<br>
_Type_: Number<br>
_Default_: `3000`
