---
title: Event Emitter
description: API docs for deepstream's event emitter
---

deepstream uses a `component-emitter` as an event emitter to implement a subset of the Node.js EventEmitter API.

## Methods

### on( event,callback )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname.
-
  arg: callback
  typ: Function
  opt: false
  des: The function that should be invoked when the event is emitted.
{{/table}}
```
Subscribe to an event.

```javascript
deepstream.on( 'error', ( error ) => {
  // do something with error
} )
```

### off( event,callback )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: true
  des: An eventname.
-
  arg: callback
  typ: Function
  opt: true
  des: The previously-registered function.
{{/table}}
```
Unsubscribes from an event by:
* removing a specific callback when called with both arguments.
```javascript
deepstream.off( 'error', errorCallback )
```
* removing all listeners for an event when only called with an event.
```javascript
deepstream.off( 'error' )
```
* removing all listeners for all events if called without arguments.
```javascript
deepstream.off()
```

### once( event,callback )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname.
-
  arg: callback
  typ: Function
  opt: false
  des: The function that should be invoked when the event is emitted.
{{/table}}
```
Register a one-time listener for an event. The listener will be removed immediately after its first execution.

```javascript
deepstream.once( 'error', function( error ) {
  // do something with error
} )
```

### emit( event... )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname.
-
  arg: arguments
  typ: Mixed
  opt: true
  des: The function that should be invoked when the event is emitted.
{{/table}}
```
Emits an event.

```javascript
deepstream.emit( 'error', 'An error of epic proportions occured!' )
```

### listeners( event )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname.
{{/table}}
```
Returns an array of listeners that are registered for the event.

```javascript
const listeners = deepstream.listeners() // [ Listener... ]
```

### hasListeners( event )
```
{{#table mode="api"}}
-
  arg: event
  typ: String
  opt: false
  des: An eventname.
{{/table}}
```
Returns true if there are listeners registered for that event.

```javascript
const hasListeners = deepstream.hasListener('error') // true
```
