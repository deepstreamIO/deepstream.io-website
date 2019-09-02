---
title: Class PresenceHandler
description: The main entry point to deepstream's presence mechanism
category: class
navLabel: PresenceHandler
body_class: dark
---

The entry point for presence, allowing clients to subscribe to and query for other connected clients.

## Methods

### String[] getAll()

Queries for all connected clients. This will return a string array of usernames or user IDs depending on whether you're connected to deepstream or deepstream. The query will also not contain the clients own user ID.

```java
JsonObject options = new JsonObject();
options.addProperty("email", "jeff@test.com");
options.addProperty("password", "sesame");
DeepstreamClient client1 = new DeepstreamClient("ws://localhost:6020");

options.addProperty("email", "ben@test.com");
options.addProperty("password", "seed");
DeepstreamClient client2 = new DeepstreamClient("ws://localhost:6020");

DeepstreamClient client3 = new DeepstreamClient("ws://localhost:6020");
client3.login();

String[] userIds = client3.presence.getAll();
// [ "client-1-id", "client-2-id" ]
```
<div></div>

### void subscribe(PresenceEventListener presenceListener)

```
{{#table mode="java-api"}}
-
  arg: listener
  typ: PresenceEventListener
  des: The listener that will be fired when a user logs in
{{/table}}
```

Subscribes the client to all client logins, note that only users who login with credentials (ie. not OPEN) will trigger the <a href="./PresenceEventListener">PresenceEventListener</a>.

```java
client.presence.subscribe(new PresenceEventListener() {
  @Override
  public void onClientLogin(String username) {
    // handle client login
  }

  @Override
  public void onClientLogout(String username) {
    // handle client logout
  }
});
```
<div></div>

### void unsubscribe(PresenceEventListener presenceListener)

```
{{#table mode="java-api"}}
-
  arg: presenceListener
  typ: PresenceEventListener
  des: The listener to remove
{{/table}}
```

Unsubscribes from an event that was previously registered with <a href="#subscribe(listener)"><code>subscribe(listener)</code></a>. This stops a client from receiving the event.

```java
client.presence.unsubscribe(eventListener);
```
<div></div>
