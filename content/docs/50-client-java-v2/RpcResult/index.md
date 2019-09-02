---
title: Class RpcResult
description: A class representing the outcome of an Remote Procedure Call
category: class
navLabel: RpcResult
body_class: dark
---

RpcResult provides access to the response state of a rpc request called via <a href="./RpcHandler#make(name,data)"><code>RpcHandler.make(name,data)</code></a>

## Methods

### boolean success()

Whether or not the RPC completed successfully

### Object getData()

The data returned by the RPC. If <a href="#success()"><code>success()</code></a> is true the resulting data from your rpc, if false data associated with why it failed.
