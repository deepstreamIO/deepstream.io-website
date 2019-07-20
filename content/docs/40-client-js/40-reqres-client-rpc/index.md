---
title: RPC
description: The API docs for remote procedure calls, deepstream's request-response mechanism
---

RPCs (Remote Procedure Calls, sometimes also referred to as Remote Method Invocation) is deepstream's implementation of request-response workflows.

## Methods

### client.rpc.provide( name, callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the RPC. Each client can only register as a provider for an RPC name once.|
|callback|Function|false|A function that handles incoming RPCs. Will be called with data and an [RPC response object](../reqres-response/).|

Registers the client as a provider for incoming RPCs of a specific name. The callback will be invoked when another client calls `client.rpc.make()`.

```javascript
client.rpc.provide( 'add-two-numbers', function( data, response ){
    response.send( data.numA + data.numB );
});
```

[[info]]
| Only one callback per client can be registered for the same RPC
| Data can be any serializable object
| Documentation for the `response` object can be found [here](../reqres-response/)

### client.rpc.unprovide( name )

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the RPC.|

Removes the client as a provider previously registered using `provide()`.

```javascript
client.rpc.unprovide( 'add-two-numbers' );
```

### client.rpc.make( name, data, callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the RPC.|
|data|Mixed|false|Any serialisable data ( Objects, Strings, Numbers... ) that will be send with the RPC.|
|callback|Function|true|A callback with either an error response or the result payload|

Executes a remote procedure call. `callback` will be invoked with the returned result or with an error if the RPC failed.

```javascript
// Callback
client.rpc.make( 'add-two-numbers', { numA:4, numB: 7 }, (error, result) => {
    // error = null, result = 11
})

// ES6
const result = await client.rpc.make('add-two-numbers', { numA: 4, numB: 7})
```
