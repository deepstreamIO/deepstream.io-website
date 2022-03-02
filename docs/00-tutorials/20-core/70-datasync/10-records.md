---
title: Records
description: Learn how you can use records and access the powerful benefits of datasync
icon: IoMdAddCircleOutline
---

Records are the main building blocks of deepstream's data-sync capabilities. They are atomic bits of JSON data that can be manipulated and observed. Any change to a record is instantly synced across all connected clients.

## Using records
Records are requested using `client.record.getRecord(name)`. If a record with the specified name doesn't exist yet, it will be created on the fly. If you just want to check if a record exists without creating it, you can use `client.record.has(name, callback)`.

Records have `set()` and `get()` methods to interact with their data and `subscribe()` to inform you about updates. Here's what that would look like in action:

```javascript
// Client A: Hungry customer sees pizza delivery approach on map
const driver = client.record.getRecord('driver/jack')
driver.subscribe('coords', updateMapPointer)
```

```javascript
// Client B: Delivery driver's smartphone feeds position into record
const driver = client.record.getRecord('driver/jack')
navigator.geolocation.watchPosition(position => {
  driver.set('coords', position.coords)
})
```

## Paths
`get()`, `set()` and `subscribe()` can be used to get the entire record's data, but also support "paths". Paths let you access sub-parts of your record's data using JSON notation, e.g. `pets[1].fur.color`. If a value for a path that doesn't exist yet is set, the path will be created on the fly.

## Record lifecycle
When calling `client.record.getRecord(name)`, one of three things can happen:

- If the record doesn't exist on the client or the server yet, it will be created. The initial data of a newly created record is an empty object `{}`.

- If the record exists on the server, but hasn't been loaded on the client yet, it will be retrieved.

- If the record is already loaded on the client, its instance will be returned.

Independent of whether the record has been loaded yet, `getRecord(name)` will return a record instance straight away. You can already start setting values or subscribing to updates at this point, however `get()` calls might return `null`.

To ensure a record is fully loaded, use the `whenReady()` method. Please note: This method will execute synchronously when the record is already available or asynchronously if its still being loaded.

#### Discarding Records
To inform the server that you're no longer interested in updates for a record, call `discard()`.

#### Deleting Records
Records can be deleted using `delete()`. Deleting also discards the record. Whenever a record is deleted by one client, the same record on all other clients will emit a `delete` event.

#### Unsubscribe, Discard and Delete - what's the difference?
`unsubscribe()` removes an existing subscription to updates to a record or path. This is purely a client side operation and doesn't notify the server.

`discard()` tells the server that you're no longer interested in receiving updates for the record.

`delete()` irreversibly deletes the record from the database and cache and notifies all servers and clients within the cluster of the deletion.

## Getting a snapshot
If you just require a static one-off view into a record's data, but not bother with the entire lifecycle you can also use `client.record.snapshot(name, callback)`

## Naming records
Each record is identified by a name that needs to be unique across the entire system. So what does a great recordname look like? Something like this:

```javascript
const book = client.record.getRecord('book/iq6auu7d-p9i1vz3q0yi')
```

This name consists of different parts: `book` is the category of the record. `/` is used as a split-character by many database connectors to sort records into tables. `iq6auu7d-p9i1vz3q0yi` is a unique id. Unique ids can be generated on the client using `client.getUid()`. They consist of a base64 encoded millisecond timestamp and a random string. UIDs are a common concept in distributed systems as they eliminate the need for a centralized, incremental id.

#### Can't unique id's clash?
Theoretically: yes. But the chances for two ids that were generated within the exact same millisecond to be the same are 1:1x10^16 - or one to 10 quadrillion - which is considered an acceptable risk.

#### Can I use more descriptive record names?
Absolutely, any string can be used as a record name. But you need to be certain that the string never changes. This is the case for many institutional usecases that are already based on unique ids. If you're building a stock trading platform, it's perfectly fine to name your record for Microsoft's stock `stock/msft`.

#### Making the username part of the record name
Many permissioning strategies in deepstream are based on record, event or
rpc-names and the data they contain.  To make sure that only `johndoe` can
change his settings, you would call your record `settings/johndoe` and specify
an associated [Valve rule](../permission/valve-simple/):

```yaml
record:
  settings/$username:
    write: "$username === user.id"
```

## Listening
Records also support a concept called "listening". Every client can register as a listener for record name patterns, e.g. `^settings/.*`. Whenever other clients start subscribing to records that match said pattern, the listener will be notified.

```javascript
// Client B
client.record.listen('settings/.*', (match, response) => {
  console.log(match) // 'settings/security'
  if (/* if you want to provide */) {
    // start publishing to this record via `client.record.setData(match, data, ack)`
    response.accept()

    response.onStop(() => {
      // stop publishing to this record when no one is interested
    })
  } else {
    response.reject() // let deepstream ask another provider
  }
})
```

This is useful to create "active" data providers - backend processes that only send out data that's actually requested. A few things worth mentioning about listening:

- The listen-callback is called once the first client subscribes to a matching record and `onStop` is called once the last subscriber for a matching record unsubscribes.

- Listening also keeps state. Registering as a listener for a pattern that already has matching subscriptions will call the callback multiple times straight away, once for every matching subscription that doesn't have a provider.

- Records have a `hasProvider` property that allows you to see if a service has accepted the listen request. This allows you to guarantee the data isn't stale.
