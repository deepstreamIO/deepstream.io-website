---
title: Class RpcHandler
description: The main access point for Remote Procedure Calls - deepstream's request-response mechanism
category: class
navLabel: RpcHandler
body_class: dark
---

The entry point for RPCs, both requesting them via <a href="#make(name,data)"><code>make(name,data)</code></a> and providing them via <a href="#provide(name,listener)"><code>provide(name,listener)</code></a>

## Methods

### RpcResult make(String rpcName, Object data)

```
{{#table mode="java-api"}}
-
  arg: rpcName
  typ: String
  des: The name of the rpc
-
  arg: data
  typ: Object
  des: Serializable data that will be passed to the provider
{{/table}}
```
Create a remote procedure call. This requires a rpc name for routing, a JSON serializable object for any associated arguments and a callback to notify you with the rpc result or potential error.

```java
RpcResult result = client.rpc.make("increment", 1);
```


### void provide(String rpcName, RpcRequestedListener rpcRequestedListener)

```
{{#table mode="java-api"}}
-
  arg: rpcName
  typ: String
  des: The rpcName of the RPC to provide
-
  arg: rpcRequestedListener
  typ: RpcRequestedListener
  des: The listener to invoke when requests are received
{{/table}}
```
Registers a `RpcRequestedListener` as a RPC provider. If another connected client calls `make(name, data)` the request will be routed to the supplied listener.

Only one listener can be registered for a RPC at a time.

Please note: Deepstream tries to deliver data in its original format. Data passed to `make(name, data)` as a String will arrive as a String, numbers or implicitly JSON serialized objects will arrive in their respective format as well.

```java
client.rpc.provide("increment", new RpcRequestedListener() {
    @Override
    public void onRPCRequested(String rpcName, Object data, RpcResponse response) {
        response.send((int) data + 1);
    }
});
```


### void unprovide(String rpcName)

```
{{#table mode="java-api"}}
-
  arg: rpcName
  typ: String
  des: The rpcName of the RPC to stop providing
{{/table}}
```

Unregister a <a href="./RpcRequestedListener"><code>RpcRequestedListener</code></a> registered via Rpc <a href="#provide(name,listener)"><code>provide(name,listener)</code></a>
