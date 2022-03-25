---
title: Record
description: The API docs for deepstream records
---

Records are one of deepstream's core features. A Record is an arbitrary JSON data structure that can be created, retrieved, updated, deleted and listened to. Records are created and retrieved using `client.record.getRecord('name')`

To learn more about how they are used, have a look at the [Record Tutorial](/tutorials/core/datasync/records/).

## Creating records

Records are created and retrieved using `client.record.getRecord( 'name' );`

```javascript
const recordName = `user/${client.getUid()}` // "user/iqaphzxy-2o1pnsvcnbo"
const record = client.record.getRecord(recordName)
```

## Properties

|Argument|Type|Description|
|---|---|---|
|name|String|The name of the record, as specified when calling `client.record.getRecord( name )`|
|isReady|Boolean|True once the record has received its current data and emitted the `'ready'` event|
|hasProvider|Boolean|True once a listener accepts subscriptions to a record. Otherwise there are no active listeners. The `'hasProviderChanged'` event is proving the information whenever the values has been changed.|
|isDestroyed|Boolean|True once the record has been discarded or deleted. The record would need to be retrieved again via `client.record.getRecord( name )|

## Events

### hasProviderChanged
Emitted whenever the `hasProvider` property has been changed. Argument is the `hasProvider` property.

### delete
Emitted when the record was deleted, whether by this client or by another.

### discard
Emitted once the record was discarded.

### error
Emitted if the record encounters an error. The error message is passed to the event callback.

## Methods

### whenReady(callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|true|A function that should be invoked as soon as the record is ready.|

Immediately executes the callback if the record is ready. Otherwise, it registers it as a callback for the `ready` event.

```javascript
// Callback
record.whenReady(record => {
  // data has now been loaded
})

// ES6
await record.whenReady()
```

### set(path, value, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|path|String|true|A particular path within the JSON structure that should be set|
|value|Various|false|The value the record or path should be set to|
|callback|Function|true|Will be called with the result of the write when using record write acknowledgements|

Used to set the record's data and can be called with a value. A path and callback can optionally be included.

Including a callback will indicate that write acknowledgement to cache or
storage is required and will slow down the operation.

[[info]]
| After calling `set`, you still have to wait for the record to be ready before a `get` call will return the value assigned by `set`.

```javascript
// Set the entire record's data
record.set({
  personalData: {
    firstname: 'Homer',
    lastname: 'Simpson',
    status: 'married'
  },
  children: ['Bart', 'Maggie', 'Lisa']
});

// Update only firstname
record.set('personalData.firstname', 'Marge')

// Set the entire record with write acknowledgement
record.set({
  personalData: { ... },
  children: [ ... ]
}, err => {
  if (err) {
    console.log('Record set with error:', err)
  } else {
    console.log('Record set without error')
  }
});

// Update only a property with write acknowledgement
record.set('personalData.firstname', 'Homer', err => {
  if (err) {
    console.log('Record set with error:', err)
  } else {
    console.log('Record set without error')
  }
})
```

### setWithAck(path, value)

|Argument|Type|Optional|Description|
|---|---|---|---|
|path|String|true|A particular path within the JSON structure that should be set|
|value|Various|false|The value the record or path should be set to|

Used to set the record's data and can be called with a value. A path can optionally be included.

This function returns a promise that fulfills when writing to cache or storage completed thus slowing down the operation.

[[info]]
| After awaiting `setWithAck`, the data is persisted so using `get` will retrieve the updated record.

```javascript
// Set the entire record's data with write acknowledgement
await record.setWithAck({
  personalData: {
    firstname: 'Homer',
    lastname: 'Simpson',
    status: 'married'
  },
  children: ['Bart', 'Maggie', 'Lisa']
});

// Update only firstname with write acknowledgement
await record.setWithAck('personalData.firstname', 'Marge')
```

### get(path)

|Argument|Type|Optional|Description|
|---|---|---|---|
|path|String|true|A particular path within the JSON structure that should be retrieved.|

Used to return the record's data but if called without an argument, will return all the data. `get()` can also be used to retrive a specific part by defining a path string. If the part can not be found, `undefined` will be returned.

```javascript
record.get() // Returns entire object
record.get('children[1]') // 'Maggie'
record.get('personalData.firstname') // 'Homer'
```

### subscribe(path, callback, triggerNow)

|Argument|Type|Optional|Description|
|---|---|---|---|
|path|String|true|A path within the JSON structure that should be subscribed to.|
|callback|Function|false|A function that is called whenever the value changes and the data passed through.|
|triggerNow|Boolean|true| If true, the callback function will be called immediately with the current value.|

Registers that a function will be called whenever the record's value changes. All of the record's data can be subscribed to by providing a callback function or when changes are performed to a specific path within the record.

Optional: Passing `true` will execute the callback immediately with the record's current value.

[[info]]
| Subscribe is an operation done per record instance. Each time you call `client.getRecord(name)` you can subscribe and then unsubscribe to that specific record instance.

Listening to any changes on the record:
```javascript
// Subscribe to any change of the record
function userDataChanged(data) {
  // do stuff...
}
user.subscribe(userDataChanged)
```

Listening to changes on a specific path within the record:
```javascript
// Only subscribe to the status of the user
function statusChanged( status ) {
  if (status === 'married') {
    // I want my childhood back!
  }
}
user.subscribe('status', statusChanged, true)
```

### unsubscribe(path, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|path|String|true|The path that was previously used for subscribe.|
|callback|Function|false|The previously registered callback function.|

Removes a subscription previous made using `record.subscribe()`. Defining a path with `unsubscribe` removes that specific path, or with a callback, can remove it from generic subscriptions.

[[info]]
|`unsubscribe` is entirely a client-side operation. To notify the server that the app would no longer interested in the record, use `discard()` instead.

Unsubscribe all callbacks registered with the path `status`:
```javascript
user.unsubscribe('status')
```

Unsubscribe a specific callback registered for the path `status`:
```javascript
user.unsubscribe('status', statusChanged)
```

Unsubscribe a specific callback registered for the record:
```javascript
user.unsubscribe(userDataChanged)
```

Unsubscribe all callbacks not associated with a path:
```javascript
user.unsubscribe()
```

### discard()
Removes all change listeners and notifies the server that client no longer wants updates for this record instance.

```javascript
user.discard()
```

[[info]]
| It is important to use this operation for record instances that are no longer needed.

### delete()

This permanently deletes the record on the server for all users.

```javascript
user.delete()
```

[[info]]
| Since deleting a record means that it no longer exists, the resulting action will be a forced discard to all clients with that record.
| Creating a record directly after deleting it without waiting for the `delete` event can end up in a race condition. Try to ensure the record has been deleted succesfully to avoid edge cases.

### erase(path: string)

Deletes a path from the record. Equivalent to doing `record.set(path, undefined)

```javascript
user.erase('name')
```

### eraseWithAck(path: string)

Deletes a path from the record and either takes a callback that will be called when the write has been done or returns a promise that will resolve when the write is done.
