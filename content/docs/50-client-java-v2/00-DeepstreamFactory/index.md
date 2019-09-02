---
title: Class DeepstreamFactory
description: A singleton that allows for shared access to a client instance
---

A singleton that allows for centralized access to a created <a href="./DeepstreamClient" title="class in io.deepstream">DeepstreamClient</a>. Alternatively, clients can be initialised directly.

Currently this only contains a single deepstream client.

## Methods

### DeepstreamFactory getInstance()

```java
DeepstreamFactory factory = DeepstreamFactory.getInstance();
```

### DeepstreamClient getClient()

Returns the last client that was created. This is useful for most applications that only require a single connection. The first time a client is connected however it has to be via <a href="#getClient(url)"><code>getClient(url)</code></a> or <a href="#getClient(url,options)"><code>getClient(url,options)</code></a>.

```java
DeepstreamFactory factory = DeepstreamFactory.getInstance();
DeepstreamClient client = factory.getClient();
```

### DeepstreamClient getClient(String url) throws URISyntaxException

|Argument|Type|Description|
|---|---|---|
|url|String|The server URL|

Returns a client that was previous created via the same url using this method or <a href="#getClient(url,options)"><code>getClient(url,options)</code></a>.

If a client hasn't been created yet, it creates it first and stores it for future reference.

```java
DeepstreamFactory factory = DeepstreamFactory.getInstance();
DeepstreamClient client = factory.getClient("ws://localhost:6020");
```

### DeepstreamClient getClient(String url, Properties options) throws URISyntaxException, InvalidDeepstreamConfig

|Argument|Type|Description|
|---|---|---|
|url|String|The server URL|
|options|Properties|The options to use within the deepstream client|

Returns a client that was previous created via the same url using this method or <a href="./DeepstreamFactory#getClient(url,options)"><code>getClient(url,options)</code></a>.

If a client hasn't been created yet, it creates it first and stores it for future reference.


