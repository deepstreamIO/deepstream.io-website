---
title: Class RpcResponse
description: A class representing the response to a Remote Procedure Call
category: class
navLabel: RpcResponse
body_class: dark
---

This object provides a number of methods that allow a RPC-provider to respond to a request

## Methods

### void ack()

Acknowledges the receipt of the request. This will happen implicitly unless the request callback explicitly sets autoAck to false

### void reject()

Reject the request. This might be necessary if the client is already processing a large number of requests. If deepstream receives a rejection message it will try to route the request to another provider - or return a NO_RPC_PROVIDER error if there are no providers left

### void send(Object data)


```
{{#table mode="java-api"}}
-
  arg: data
  typ: Objet
  des: The response data. Has to be JsonSerializable
{{/table}}
```
Completes the request by sending the response data to the server. If data is an array or object it will automatically be serialised.
If autoAck is disabled and the response is sent before the ack message the request will still be completed and the ack message ignored


### void error(String errorMessage)


```
{{#table mode="java-api"}}
-
  arg: errorMsg
  typ: String
  des: The message used to describe the error that occured
{{/table}}
```

Notifies deepstream that an error has occured while trying to process the request. This will complete the rpc.