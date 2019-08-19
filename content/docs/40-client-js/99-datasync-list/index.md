---
title: List
description: API docs for deepstream's list object, a manageable collection of record names
---

Lists are collections of record names. To learn more about how they are used, have a look at the [List Tutorial](../../../tutorials/core/datasync/lists/).

Lists and record names have an `n:m` relationship. A record name can be part of many lists and a list can contain many record names. A list can also contain the same record name multiple times.

## Creating lists
Lists are created and retrieved using `client.record.getList( 'name' );`

```javascript
const list = client.record.getList( 'cars' );
```

## Properties

|Argument|Type|Description|
|---|---|---|
|name|String|The name of the list, as specified when calling `client.record.getList( 'name' );`|
|isReady|Boolean|True once the list has received its current data and emitted the `'ready'` event|

## Events

### ready
Emitted once the list has received its current data from the server.

### entry-added
Emitted whenever a new entry is added to the list. Passes the entry and its position within the list to the callback.

### entry-moved
Emitted whenever an entry is moved within the list. Passes the entry and its new position within the list to the callback.

### entry-removed
Emitted whenever an entry is removed from the list. Passes the entry and its last position within the list to the callback.

### delete
Emitted when the list was deleted, whether by this client or by another.

### discard
Emitted once the list was discarded.

### error
Emitted if the list encounters an error. The error message is passed to the event callback.

## Methods

### whenReady( callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|true|A function that will be invoked as soon as the list is ready. Receives the list as an argument|

Invokes `callback` once the list has been loaded. This might happen synchronously if the list is already available or asynchronously if the list still needs to be retrieved. Some methods, e.g. `addEntry()` or `setEntries()` or `subscribe()` can be used before the list is ready.

```javascript
// Callback
list.whenReady( ( list ) => {
  // interact with the list
});

// ES6
await list.whenReady()
```

### isEmpty()

Returns `false` if the list has entries or `true` if it doesn't.

```javascript
if( list.isEmpty() ) {
  // You don't have any entries
}
```

### getEntries()
Returns an array of the current entries in the list.

```javascript
const entries = list.getEntries()
console.log( entries ) // [ 'car/1', 'car2' ]
```

### setEntries( entries )

|Argument|Type|Optional|Description|
|---|---|---|---|
|entries|Array|false|An array of record name strings|

Sets the contents of the list to the provided array of record names. To add or remove specific entries use `addEntry()` or `removeEntry()` respectively.

```javascript
list.setEntries( [ 'car/1', 'car/2' ] );
```

### addEntry( entry, index )

|Argument|Type|Optional|Description|
|---|---|---|---|
|entry|String|false|A record name that should be added to the list|
|index|Number|true|An optional index that the new entry should be inserted at. If omitted, the new entry is appended to the end of the list.|

Adds a new record name to the list.

```javascript
function addCar( number ) {
  const id = 'car/' + client.getUid();
  client.record.getRecord( id ).set( 'number', number );
  list.addEntry( id );
}
```

### removeEntry( entry, index )

|Argument|Type|Optional|Description|
|---|---|---|---|
|entry|String|false|A record name that should be removed to the list|
|index|Number|true|An optional index that the entry should be removed from at. If ommited, all entries of the given name will be removed.|

Removes an entry from the list. `removeEntry` will not throw any error if the entry doesn't exist.

```javascript
function removeCar( carRecord ) {
  list.removeEntry( carRecord.name );
}
```

### subscribe( callback, triggerNow )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|false|A callback function that will be called whenever the content of the list changes|
|triggerNow|Boolean|true|If true, the callback function will be called immediately with the current value|

Registers a function that will be invoked whenever any changes to the list's contents occur. Optionally you can also pass `true` to execute the callback function straight away with the list's current entries.

```javascript
function listChanged( entries ) {
  // entries in list has changed
}
list.subscribe( listChanged, false );
```

### unsubscribe( callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|true|The previously registered callback function. If ommited, all listeners will be unsubscribed.|

Removes a subscription that was previously made using `list.subscribe()`

Please Note: unsubscribe is purely a client side operation. To notify the server
that the app no longer requires updates for this list use `discard()`.

```javascript
list.unsubscribe( listChanged );
```

### discard()
Removes all change listeners and notifies the server that the client is no longer interested in updates for this list.

```javascript
list.discard();
```

[[info]]
| It is important to make sure that `discard()` is called for any list that's no longer needed. If you only remove the listeners using `unsubscribe()` the server won't be notified and will continue to send updates to the client.

### delete()
Deletes the list on the server. This action deletes the list for all users from both cache and storage and is irreversible.

```javascript
list.delete();
```
