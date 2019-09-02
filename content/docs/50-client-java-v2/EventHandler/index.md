---
title: Class EventHandler
description: The main entry point to deepstream's publish-subscribe mechanism
category: class
navLabel: EventHandler
body_class: dark
---

The entry point for events, such as <a href="#subscribe(eventName,listener)"><code>subscribe(eventName, listener)</code></a>, <a href="#emit(eventName)"><code>emit(eventName)</code></a> and provider functionality such as <a href="#listen(eventName,listener)"><code>listen(eventName, listener)</code></a>.

## Methods

### void emit(String eventName)

```
{{#table mode="java-api"}}
-
  arg: eventName
  typ: String
  des: The event name
{{/table}}
```

Sends the event to all subscribed clients without a payload.

```java
client.event.emit("notifications");
```
<div></div>

### void emit(String eventName, Object data)

```
{{#table mode="java-api"}}
-
  arg: eventName
  typ: String
  des: The event name
-
  arg: data
  typ: Object
  des: The data to serialise and send with the event
{{/table}}
```

Sends the event to all subscribed clients with the given payload.

```java
client.event.emit("notifications", "example payload")
```
<div></div>

### void subscribe(String eventName, EventListener EventListener)

```
{{#table mode="java-api"}}
-
  arg: eventName
  typ: String
  des: The event name
-
  arg: eventListener
  typ: EventListener
  des: The Event Listener
{{/table}}
```

Subscribes to eventName and notifies the listener via EventListener whenever it occurs locally or remotely.

```java
client.event.subscribe("notifications", new EventListener() {
    @Override
    public void onEvent(String eventName, Object data) {
        // handle event
    }
});
```
<div></div>

### void unsubscribe(String eventName, EventListener EventListener)

```
{{#table mode="java-api"}}
-
  arg: eventName
  typ: String
  des: The event name
-
  arg: eventListener
  typ: EventListener
  des: The Event Listener
{{/table}}
```

Unsubscribes from an event that was previously registered with `subscribe()`. This stops a client from receiving the event.

```java
client.event.unsubscribe(eventListener);
```
<div></div>

### void listen(String pattern, ListenListener listen)" mode="opensource / enterprise

```
{{#table mode="java-api"}}
-
  arg: pattern
  typ: String
  des: The pattern to match events which subscription status you want to be informed of
-
  arg: listener
  typ: ListenListener
  des: The Listen Listener
{{/table}}
```

Registers the client as a listener for event subscriptions made by other clients. This is useful to create active data providers - processes that only send events if clients are actually interested in them. You can find more about listening in the [events tutorial](/tutorials/guides/active-data-providers).

```java
client.event.listen("users/*", new ListenListener() {
  @Override
  public boolean onSubscriptionForPatternAdded(String subscription) {
    if (/* can provide */) {
      return true;
    } else {
      return false;
    }
  }

  @Override
  public void onSubscriptionForPatternRemoved(String subscription) {
    // handle unsubscription
  }
});
```

### void unlisten(String pattern)" mode="opensource / enterprise

```
{{#table mode="java-api"}}
-
  arg: pattern
  typ: String
  des: The pattern that has been previously listened to
{{/table}}
```

Remove the listener added via <a href="#listen(pattern,listener)"><code>listen(pattern,listener)</code></a>. This will remove the provider as the active provider and allow another provider to take its place.

```java
client.event.unlisten("users/*", listener);
```
