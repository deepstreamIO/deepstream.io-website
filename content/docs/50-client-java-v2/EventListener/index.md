---
title: Interface EventListener
description: A listener that's notified whenever an event is received via deepstream's pub-sub mechanism
category: interface
navLabel: EventListener
body_class: dark
---

This listener is notified whenever a given event is triggered, whether by this client or by another. It can be added via <a href="./EventHandler#subscribe(eventName,listener)"><code>EventHandler.subscribe(eventName,listener)</code></a>

## Methods

### void onEvent(String eventName, Object data)

```
{{#table mode="java-api"}}
-
  arg: eventName
  typ: String
  des: The event name
-
  arg: data
  typ: Object
  des: The arguments that the event has been called with
{{/table}}
```
