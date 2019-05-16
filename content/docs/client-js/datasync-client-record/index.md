---
title: Record Factory
description: This class gives you access to all methods related to data-sync
---

`client.record` gives you access to all methods related to data-sync.

## Prerequisite

You need to connect to the deepstream server:

```javascript
const deepstream = require('deepstream.io-client-js')
const client = deepstream( 'localhost:6020')
client.login()
```

## Methods

### client.record.getRecord(name)

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the record.|

Retrieves and if necessary creates a [Record](/docs/client-js/datasync-record/) with the given name. Records are persistent data structures that are synced between clients. To learn more about what they are used for and how they work, head over to the [record tutorial](/tutorials/core/datasync/records/).

[[info]]
| The record will be loaded asynchronously. To ensure the record is loaded put your logic into the [whenReady](/tutorials/core/datasync/records/) callback.

```javascript
const record = client.record.getRecord('user/johndoe')
```

### client.record.getList(name)

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the list.|

Retrieves or creates a [List](../datasync-list/) with the given name. Lists are arrays of recordNames that clients can manipulate and observe. You can learn more about them in the [list tutorial](//tutorials/core/datasync/lists/).

[[info]]
| The list will be loaded asynchronously. To ensure the list is loaded put your logic into the [whenReady](/tutorials/core/datasync/records/) callback.

```javascript
const beatlesAlbums = client.record.getList('albums')
beatlesAlbums.whenReady(() => {
  console.log(beatlesAlbums.getEntries())
})
/*
  [
    "album/i9l0z34v-109vblpqddy",
    "album/i9l0z3v4-ibrbp139rbr",
    "album/i9l0z4d8-1w0p8xnk1sy"
  ]
*/
```

### client.record.getAnonymousRecord()

Returns an [AnonymousRecord](../datasync-anonymous-record/).

An AnonymousRecord is a record that can change its name. It
acts as a wrapper around an actual record that can
be swapped out for another one whilst keeping all bindings intact.
You can learn more about anonymous records [here](/tutorials/core/datasync/anonymous-records/).

```javascript
const record = client.record.getAnonymousRecord()
record.setName('user/johndoe')
record.setName('user/maxpower')
```

### client.record.has(name, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the record.|
|callback|Function|true|Arguments are (String) error and (Boolean) hasRecord|

The callback contains an error argument and a boolean to indicate whether or not the record exists in deepstream. This is useful to avoid creating a record via `getRecord( name )` if you only want to edit the contents. The callback is invoked immediately if the record exists on the client.

```javascript
// Callback
client.record.has('user/johndoe', (error, hasRecord) => {
  // ...
})

// Promise
try {
  const hasRecord = await client.record.has('user/johndoe')
  // ...
} catch (error) {

}
```

### client.record.snapshot(name, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the record.|
|callback|Function|true|Arguments are (String) error and (Object) data|

The callback contains the record's content without subscribing to updates. This can be used to avoid scenarios where you would request the record and discard it immediately afterwards. The callback is invoked immediately if the record data is already loaded and ready.

```javascript
// Callback
client.record.snapshot('user/johndoe', (error, data) => {
	// ...
})

// Promise
try {
  const data = await client.record.snapshot('user/johndoe')
} catch (error) {

}
```

### client.record.setData(name, path, data, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|name|String|false|The name of the record.|
|path|String|true|The path of the record to set data.|
|data|Various|false|The data to set on the record.|
|callback|Function|true|Arguments are (String) error|

An upsert operation that allows updating of a record without being subscribed to it. If the record does not exist deepstream will try and permission the request to create the record. The callback if provided will be called with any errors that occurred while writing to the record.

```javascript
// Set the entire record's data - record will be created if it doesn't exist
client.record.setData('user/homer', { status: 'married' })

// Update only marriage status
record.set('user/homer', 'status', 'single')

// Set the entire record's data with write acknowledgement
client.record.setData('user/homer', { status: 'married' }, (error) => {
  // ...
})

// Update only a property with write acknowledgement
client.record.setData('user/homer', 'son', 'Bart', (err) => {
  // ...
})
```

### client.record.listen(pattern, callback)

|Argument|Type|Optional|Description|
|---|---|---|---|
|pattern|String (regex)|false|The pattern to match records which subscription status you want to be informed of|
|callback|Function|false|A function that will be called whenever an event has been initially subscribed to or is no longer subscribed. Arguments are (String) match, (Boolean) isSubscribed and response (Object).|

Allows to listen for record subscriptions made by other clients. This is useful to create "active" data providers, e.g. providers that only provide data for records that users are actually interested in. You can find more about listening in the [record tutorial](/tutorials/core/datasync/records/).

The callback is invoked with three arguments:
- **match**: The name of the record that has been matched against the provided pattern
- **isSubscribed**: A boolean indicating whether the record is subscribed or unsubscribed
- **response**: contains two functions (`accept` and `reject`), one of them needs to be called

```javascript
client.record.listen('raceHorse/.*', (match, isSubscribed, response) => {
  // see tutorial for more details
})
```

[[info]]
|The callback will be called for all matching subscriptions that already exist at the time its registered.

### client.record.unlisten(pattern)

|Argument|Type|Optional|Description|
|---|---|---|---|
|pattern|String (regex)|false|The previously registered pattern|

```javascript
client.record.unlisten('raceHorse/.*')
```

Removes a listener that was previously registered using `listen()`.
