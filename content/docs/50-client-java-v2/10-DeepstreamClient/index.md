---
title: Class DeepstreamClient
description: The main entrypoint for client operations
---

The main entry point for a DeepstreamClient. Clients can be created directly using the constructor or via <a href="./DeepstreamFactory#getClient()"><code>DeepstreamFactory.getClient()</code></a>, <a href="./DeepstreamFactory#getClient(url)"><code>DeepstreamFactory.getClient(url)</code></a> or
<a href="./DeepstreamFactory#getClient(url,options)"><code>DeepstreamFactory.getClient(url, options)</code></a> to create a client and keep it as a singleton for future references.

## Fields

### record

Allows access to concepts related to deepstream's realtime datastore, such as:
- get a reference to records via <a href="./RecordHandler#getRecord(recordName)"><code>record.getRecord(recordName)</code></a>
- get a reference to list via <a href="./RecordHandler#getList(listName)"><code>record.getList(listName)</code></a>
- retrieve a snapshot of the record data via <a href="./RecordHandler#snapshot(recordName)"><code>record.snapshot(recordName)</code></a>

### event

The entry point for events, such as:
- subscribing to events via <a href="./EventHandler#subscribe(eventName,listener)"><code>event.subscribe(eventName, listener)</code></a>
- sending data on topics via <a href="./EventHandler#emit(eventName)"><code>event.emit(eventName)</code></a>
- listening for topic subscriptions via <a href="./EventHandler#listen(name,listener)"><code>event.listen(name,listener)</code></a>

### rpc

The entry point for RPCs, deepstream's request-response mechanism:
- requesting via <a href="./RpcHandler#make(name,data)"><code>RpcHandler.make(name,data)</code></a>
- providing via <a href="./RpcHandler#provide(name,listener)"><code>RpcHandler.provide(name,listener)</code></a>

## Constructors

### DeepstreamClient(String url) throws URISyntaxException

|Argument|Type|Description|
|---|---|---|
|options|url|The url to connect to|

Creates a client instance using the default properties and initialises the connection to deepstream. The connection will be kept in a quarantine state and won't be fully usable until <a href="#login()"><code>DeepstreamClient.login()</code></a> is called.

```java
DeepstreamClient client = new DeepstreamClient("ws://localhost:6020");
```
<div></div>

### DeepstreamClient(String url, Properties options) throws URISyntaxException,   

|Argument|Type|Description|
|---|---|---|
|options|url|The url to connect to|
|properties|Properties|The properties to configure the client with|


Creates a client instance, merging the default options with the passed in configuration and initialises the connection to deepstream. The connection will be kept in a quarantine state and won't be fully usable until <a href="#login()"><code>DeepstreamClient.login()</code></a> is called.

```java
Properties options = new Properties();
properties.setProperty(ConfigOptions.RPC_RESPONSE_TIMEOUT.toString(), "10");
DeepstreamClient client = new DeepstreamClient("ws://localhost:6020", options);
```

## Methods

### void setRuntimeErrorHandler(DeepstreamRuntimeErrorHandler handler)

|Argument|Type|Description|
|---|---|---|
|handler|DeepstreamRuntimeErrorHandler|The listener to set|

Adds a <a href="./DeepstreamRuntimeErrorHandler" title="interface in io.deepstream"><code>DeepstreamRuntimeErrorHandler</code></a> that will catch all RuntimeErrors such as AckTimeouts and allow the user to gracefully handle them.

```java
client.setRuntimeErrorHandler(new DeepstreamRuntimeErrorHandler() {
    @Override
    public void onException(Topic topic, Event event, String errorMessage) {
        // handle error
    }
});
```

### LoginResult login()

Authenticates the client against the platform with an empty authentication object and returns a <a href="./LoginResult">LoginResult</a>. To learn more about how authentication works, please have a look at the [Security Overview](/tutorials/guides/security-overview/).

```java
DeepstreamClient client = new DeepstreamClient("ws://localhost:6020");
LoginResult result = client.login();
```
<div></div>

### LoginResult login(JsonElement authParams)

|Argument|Type|Description|
|---|---|---|
|authParams|JsonElement|JSON.serializable authentication data|

Authenticates the client against the platform with the given credentials and returns a <a href="./LoginResult">LoginResult</a>. To learn more about how authentication works, please have a look at the [Security Overview](/tutorials/guides/security-overview/).

```java
DeepstreamClient client = new DeepstreamClient("ws://localhost:6020");
JsonObject credentials = new JsonObject();
credentials.addProperty("email", "user@example.com");
credentials.addProperty("email", "sesame");
LoginResult result = client.login(credentials);
```
<div></div>

### DeepstreamClient close()

Ends the connection to the platform.

```java
client.addConnectionChangeListener(new ConnectionStateListener() {
    @Override
    public void connectionStateChanged(ConnectionState connectionState) {
        // will be CLOSED once the connection is successfully closed
    }
});

client.close();
```
<div></div>

### DeepstreamClient addConnectionChangeListener (ConnectionStateListener listener)

|Argument|Type|Description|
|---|---|---|
|connectionStateListener|ConnectionStateListener|The listener to add|

Add a listener that can be notified via <a href="./ConnectionStateListener#connectionStateChanged(state)" title="interface in io.deepstream"><code>ConnectionStateListener.connectionStateChanged(state)</code></a> whenever the ConnectionState changes. A list of possible connection states is available [here](/docs/general/connectivity/#connection-states)

```java
client.addConnectionChangeListener(new ConnectionStateListener() {
    @Override
    public void connectionStateChanged(ConnectionState connectionState) {
        // handle change
    }
});
```
<div></div>

### DeepstreamClient removeConnectionChangeListener(ConnectionStateListener listener

|Argument|Type|Description|
|---|---|---|
|connectionStateListener|ConnectionStateListener|The listener to remove|

Removes a ConnectionStateListener added via <a href="#addConnectionChangeListener(listener)"><code>DeepstreamClient.addConnectionChangeListener()</code></a>

```java
client.removeConnectionChangeListener(connectionStateChangedListener);
```

### String getUid()

Returns a random id. The first block of characters is a timestamp, in order to allow databases to optimize for semi- sequentuel numberings.

```java
client.getUid();
```

