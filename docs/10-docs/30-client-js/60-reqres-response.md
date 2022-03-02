---
title: RPC Response
description: The API docs for deepstream's RPC response object
---

The RPC response object is passed to the callback registered with `client.rpc.provide()`. It allows RPC providers to decide how to react to an incoming request.

## Methods

### response.send( data )

|Argument|Type|Optional|Description|
|---|---|---|---|
|data|Mixed|false|Any serializable response data|

Succesfully complete a remote procedure call and send data back to the requesting client.

`data` can be any kind of serializable data, e.g., Objects, Numbers, Booleans, or Strings.

If `autoAck` is disabled and the response is sent before the ack message arrives, then the request will still be completed and the ack message will be ignored.

```javascript
client.rpc.provide( 'add-two-numbers', (data, response) => {
  response.send( data.numA + data.numB )
})
```

### response.reject()
Rejects the request. Rejections are not errors but merely a means of saying "I'm busy at the moment, try another client". Upon receiving a rejection, deepstream will try to re-route the request to another provider for the same RPC. If there are no more providers left to try, deepstream will send a `NO_RPC_PROVIDER` error to the client.

```javascript
client.rpc.provide('add-two-numbers', (data, response) => {
  //reject the response so that it gets
  //re-routed to another provider
  response.reject()
})
```

### error( errorMsg )

|Argument|Type|Optional|Description|
|---|---|---|---|
|errorMsg|Variant|false|A result object that will be passed as an error to the RPC requester.|

Send an error to the client. `errorMsg` will be received as the first argument to the callback registered with `client.rpc.make()`. This will complete the RPC.

```javascript
client.rpc.provide( 'count-vote', (data, response) => {
  if( hasAlreadyVoted(data.user) ) {
   response.error( 'You can only vote once')
  }
})
```

### response.ack()
Explicitly acknowledges the receipt of a request.

This is usually done automatically but can also be performed explicitly by setting `response.autoAck = false` and calling `ack()` later. This is useful when a client needs to perform an asynchronous operation to determine if it will accept or reject the request.

[[info]]
| Requests count as completed once `send()` or `error()` was called. Calling `ack()` after that won't do anything.

```javascript
client.rpc.provide('support/billing', (data, response) => {
  // Turn of automatic acknowledgements. This needs to happen synchronously
  response.autoAck = false

  // Acknowledge the request yourself at a later point
  hasCapacities().then(() => {
    response.ack()
  })
})
```
