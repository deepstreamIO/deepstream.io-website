---
title: Record
description: The API docs for deepstream records
---

Records are one of deepstream's core features. A Record is an arbitrary JSON data structure that can be created, retrieved, updated, deleted and listened to. Records are created and retrieved using `client.record.getRecord('name')`

To learn more about how they are used, have a look at the [Record Tutorial](/tutorials/core/datasync-records/).

## Creating records

Records are created and retrieved using `client.record.getRecord( 'name' );`

```javascript
const recordName = `user/${client.getUid()}` // "user/iqaphzxy-2o1pnsvcnbo"
const record = client.record.getRecord(recordName)
```

## Properties

```
{{#table mode="api"}}
-
  arg: name
  typ: String
  desc: The name of the record, as specified when calling `client.record.getRecord( name )`
-
  arg: usages
  typ: Number
  desc: The number of active records throughout the application, meaning they have not yet been discarded via `discard()`
-
  arg: isReady
  typ: Boolean
  desc: True once the record has received its current data and emitted the `'ready'` event
-
  arg: hasProvider
  typ: Boolean
  desc: True once a listener accepts subscriptions to a record. Otherwise there are no active listeners. The `'hasProviderChanged'` event is proving the information whenever the values has been changed.
-
  arg: isDestroyed
  typ: Boolean
  desc: True once the record has been discarded or deleted. The record would need to be retrieved again via `client.record.getRecord( name )
{{/table}}
```

## Events

### ready
Emitted once the record has received its current data from the server.

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
```
{{#table mode="api"}}
-
  arg: callback
  typ: Function
  opt: false
  des: A function that should be invoked as soon as the record is ready.
{{/table}}
```
Immediately executes the callback if the record is ready. Otherwise, it registers it as a callback for the `ready` event.

```javascript
record.whenReady(record => {
  // data has now been loaded
})
```

### set(path, value, callback)

```
{{#table mode="api"}}
-
  arg: path
  typ: String
  opt: true
  des: A particular path within the JSON structure that should be set
-
  arg: value
  typ: Various
  opt: false
  des: The value the record or path should be set to
-
  arg: callback
  typ: Function
  opt: true
  des: Will be called with the result of the write when using record write acknowledgements (available in deepstream 2.1.0 or newer)
{{/table}}
```
Used to set the record's data and can be called with a value. A path and callback can optionally be included.

Including a callback will indicate that write acknowledgement to cache or
storage is required and will slow down the operation. The callback is available
in deepstream 2.1.0 or newer.

{{#infobox "info"}}
-  After calling `set`, you still have to wait for the record to be ready before
   a `get` call will return the value assigned by `set`.
{{/infobox}}

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

### get(path)

```
{{#table mode="api"}}
-
  arg: path
  typ: String
  opt: true
  des: A particular path within the JSON structure that should be retrieved.
{{/table}}
```
Used to return the record's data but if called without an argument, will return all the data. `get()` can also be used to retrive a specific part by defining a path string. If the part can not be found, `undefined` will be returned.

```javascript
record.get() // Returns entire object
record.get('children[1]') // 'Maggie'
record.get('personalData.firstname') // 'Homer'
```

### subscribe(path, callback, triggerNow)
```
{{#table mode="api"}}
-
  arg: path
  typ: String
  opt: true
  des: A path within the JSON structure that should be subscribed to.
-
  arg: callback
  typ: Function
  opt: false
  des: A function that is called whenever the value changes and the data passed through.
-
  arg: triggerNow
  typ: Boolean
  opt: true
  des: If true, the callback function will be called immediately with the current value.
{{/table}}
```
Registers that a function will be performed whenever the record's value changes. All of the record's data can be subscribed to by providing a callback function or when changes are performed to a specific path within the record.

Optional: Passing `true` will execute the callback immediately with the record's current value.

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
  if (status !== 'married') {
    // I want my childhood back!
  }
}
user.subscribe('status', statusChanged, true)
```

### unsubscribe(path, callback)
```
{{#table mode="api"}}
-
  arg: path
  typ: String
  opt: true
  des: The path that was previously used for subscribe.
-
  arg: callback
  typ: Function
  opt: true
  des: The previously registered callback function.
{{/table}}
```
Removes a subscription previous made using `record.subscribe()`. Defining a path with `unsubscribe` removes that specific path, or with a callback, can remove it from generic subscriptions.

{{#infobox "info"}}
- `unsubscribe` is entirely a client-side operation. To notify the server that
  the app would no longer interested in the record, use `discard()` instead.
{{/infobox}}

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
<br/>
{{#infobox "info"}}
- It is important to unsubscribe all callbacks that are registered when
  discarding a record. Just calling discard does **not** guarantee that
  callbacks will not be called.
{{/infobox}}

### discard()
Removes all change listeners and notifies the server that client no longer wants updates for this record if your application
no longer requires the record.

```javascript
user.discard()
```

<br/>
{{#infobox "info"}}
- It is important to use this operation for records that are no longer needed.
  `unsubscribe()` only removes listeners and does not notify the server; in this
  case, the server will continue to send updates to the client.
- Records are only discarded when you have no record subscriptions left.
{{/infobox}}

### delete()
This permanently deletes the record on the server for all users.

```javascript
user.delete()
```

<br/>
{{#infobox "info"}}
- Since deleting a record means that it no longer exists, the resulting action
  will be a forced discard to all clients with that record.
- Creating a record directly after deleting it without waiting for the `delete`
  event can end up in a race condition. Try to ensure the record has been
  deleted succesfully to avoid edge cases.
{{/infobox}}
