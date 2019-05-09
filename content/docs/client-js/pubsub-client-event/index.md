---
title: Event
description: API docs for deepstream's events, the many to many broadcasting mechanism
---

Events are deepstream's implementation of the publish/subscribe pattern. You can find more about how they are used in the [events tutorial](/tutorials/core/pubsub-events/).

## Methods

### client.event.subscribe( event, callback )
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname
-
  arg: callback
  typ: Function
  opt: false
  des: A function that will be called whenever the event is emitted
{{/table}}

Subscribes to an event. Callback will receive the data passed to `emit()`

```javascript
// Client A
client.event.subscribe('news/sports', data => {
  // handle published data
})

// Client B
client.event.emit('news/sports', /* data */)
```

### client.event.unsubscribe( event, callback )
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname
-
  arg: callback
  typ: Function
  opt: true
  des: The callback that was previously registered with subscribe. If the callback is omitted, all listeners for the event will be removed
{{/table}}

Unsubscribes from an event that was previously registered with `subscribe()`. This stops a client from receiving the event.

```javascript
// Client A
client.event.unsubscribe('news/politics', callback)
```

### client.event.emit( event, data )
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname
-
  arg: data
  typ: Mixed
  opt: true
  des: Any serialisable data ( Objects, Strings, Numbers... ) that will be sent with the event
{{/table}}

Sends the event to all subscribed clients

```javascript
// Client B
client.event.emit('notifications', 'Maria just came online')
```

### client.event.listen( pattern, callback )
{{#table mode="api"}}
-
  arg: pattern
  typ: String (regex)
  opt: false
  des: The pattern to match events which subscription status you want to be informed of
-
  arg: callback
  typ: Function
  opt: false
  des: A function that will be called whenever an event has been initially subscribed to or is no longer subscribed. Arguments are (String) match, (Boolean) isSubscribed, and response (Object)
{{/table}}

Registers the client as a listener for event subscriptions made by other clients. This is useful to create active data providers - processes that only send events if clients are actually interested in them. You can find more about listening in the [events tutorial](/tutorials/core/pubsub-events/#how-to-listen-for-event-subscriptions).

The callback is invoked with three arguments:
- **eventName**: the name of the event that has been matched against the provided pattern
- **isSubscribed**: a boolean indicating whether the event is subscribed or unsubscribed
- **response**: contains two functions (`accept` and `reject`), one of them needs to be called

```javascript
client.event.listen('^news/.*', (eventName, isSubscribed, response) => {
  // see tutorial for more details
})
```

### client.event.unlisten( pattern )
{{#table mode="api"}}
-
  arg: pattern
  typ: String (regex)
  opt: false
  des: The previously registered pattern
{{/table}}

This removes a previously registered listening pattern and the user will no longer be listening for active/inactive subscriptions.

```javascript
client.event.unlisten('^news/.*')
```
