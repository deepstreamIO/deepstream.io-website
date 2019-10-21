---
title: Getting started with Java
description: Learn how to build serverside realtime provider with deepstream and Java
tags: [Java, realtime, RPC, request-response, data-sync]
wip: true
---

This guide will show you how to build backend processes in Java using deepstream's three core concepts: [Records](/tutorials/guides/records/), [Events](/tutorials/guides/events/) and [RPCs](/tutorials/guides/remote-procedure-calls/).

`markdown:setting-up-deepstream.md`

## Connect to deepstream and log in

The first thing you'll need to do is set up a Java project with gradle and add the following line to your `build.gradle` file.

```bash
compile 'io.deepstream:deepstream.io-client-java:2.0.4'
```

From here we can instantiate a client as follows:

```javascript
DeepstreamClient client = new DeepstreamClient("<Your app url here>");
```

and log in (we didn't configure any authentication, so there are no credentials required)

```java
client.login();
```

## Records (realtime datastore)

`markdown:glossary-record.md`

Creating a new record or retrieving an existent one is done using `getRecord()`

```java
Record record = client.record.getRecord("test-record");
```

Values can be stored using the `.set()` method

```java
// you can set the whole record
JsonObject data = new JsonObject();
data.addProperty("name", "Alex");
data.addProperty("favouriteDrink", "coffee");
record.set(data);

// or just a path
record.set( "hobbies", new String[]{ "sailing", "reading" });
```

and be retrieved using `.get()`

```java
record.get(); // returns all record data as a JsonElement
record.get( "hobbies[1]" ); // returns the JsonElement 'reading'
```

subscribe to changes by you or other clients using `.subscribe()`

```java
//subscribe to changes made by you or other clients using .subscribe()
record.subscribe(new RecordChangedCallback() {
    public void onRecordChanged(String recordName, JsonElement data) {
        // some value in the record has changed
    }
});

record.subscribe( "firstname", new RecordPathChangedCallback() {
    public void onRecordPathChanged(String recordName, String path, JsonElement data) {
        // the field "firstname" changed
    }
});
```

you can remove subscriptions with `unsubscribe()`, tell the server you're no longer interested in the record using `.discard()` or delete it using `.delete()`.

## Events (publish-subscribe)
`markdown:glossary-event.md`

Clients and backend processes can receive events using `.subscribe()`

```java
client.event.subscribe("test-event", new EventListener() {
    public void onEvent(String eventName, Object data) {
        // do something with data
    }
});
```

... and publish events using `.emit()`

```java
client.event.emit( "test-event", "some data");
```

## RPCs (request-response)
`markdown:glossary-rpc.md`

You can make a request using `.make()`

```java
JsonObject jsonObject = new JsonObject();
jsonObject.addProperty("a", 7);
jsonObject.addProperty("b", 8);
RpcResult rpcResult = client.rpc.make( "multiply-numbers", jsonObject);
int result = (Integer) rpcResult.getData(); // 56
```

and answer it using `.provide()`

```java
client.rpc.provide("multiply-numbers", new RpcRequestedListener() {
    public void onRPCRequested(String name, Object data, RpcResponse response) {
        Gson gson = new Gson();
        JsonObject jsonData = (JsonObject) gson.toJsonTree(data);
        int a = jsonData.get("a").getAsInt();
        int b = jsonData.get("b").getAsInt();
        response.send(a * b);
    }
});
```
