---
title: Interface RpcRequestedListener
description: A listener that's notified with the response to a Remote Procedure Call
category: interface
navLabel: RpcRequestedListener
body_class: dark
---

Listener for any rpc requests recieved from the server

## Methods

### void onRPCRequested(String rpcName, Object data, RpcResponse response)

```
{{#table mode="java-api"}}
-
  arg: rpcName
  typ: String
  des: The name of the rpc being requested
-
  arg: data
  typ: Object
  des: The data the request was made with-
-
  arg: response
  typ: RpcResponse
  des: The RpcResponse to respond to the request with
{{/table}}
```

This listener will be invoked whenever the client recieves an rpc request from the server, and will be able to respond via <a href="./RpcResponse#send(data)"><code>RpcResponse.send(data)</code></a> or <a href="./RpcResponse#reject()"><code>RpcResponse.reject()</code></a>