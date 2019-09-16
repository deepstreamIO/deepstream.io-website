---
title: "Release: Javascript/Node 4.0" 
description: The newly improved Typescript and ES6 SDK
redirectFrom: [/releases/client-js/v4-0-0/]
---

### Features:

- New binary protocol support (under the hood)
- Bulk actions support (under the hood)
- Full typescript declaration files
- Promises everywhere! Long live async/await!
- Offline record support

```JavaScript
{
    // Use indexdb to store data client side
    offlineEnabled: false,
    // Save each update as it comes in from the server
    saveUpdatesOffline: false,
    indexdb: {
        // The db version, incrementing this triggers a db upgrade
        dbVersion: 1,
        // This auto updates the indexdb version if the objectStore names change
        autoVersion: false,
        // The key to index records by
        primaryKey: 'id',
        // The indexdb databae name
        storageDatabaseName: 'deepstream',
        // The default store name if not using a '/' to indicate the object store (example person/uuid)
        defaultObjectStoreName: 'records',
        // The object store names, required in advance due to how indexdb works
        objectStoreNames: [],
        // Things to not save, such search results
        ignorePrefixes: [],
        // The amount of time to buffer together actions before making a request
        flushTimeout: 50
    }
}
```

- Customizable offline storage support

```typescript
export type offlineStoreWriteResponse = ((error: string | null, recordName: string) => void)

export interface RecordOfflineStore {
  get: (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) => void
  set: (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) => void
  delete: (recordName: string, callback: offlineStoreWriteResponse) => void
}
```

### Improvements

- Separation of errors and warnings for clarity. Non critical failures (such as an ack timeout) can now be treated separated or fully muted.
- Enhanced services to reduce timeout overhead

### Backwards compatibility

- Only works with V4 server
- All single response APIs now return promises when not providing a callback. This means most APIs that could have been chained would now break.

```JavaScript
const client = deepstream()
try {
    await client.login()

    const record = client.record.getRecord(name)
    await record.whenReady()

    const data = await client.record.snapshot(name)
    const version = await client.record.head(name)
    const exists = await client.record.has(name)
    const result = await client.rpc.make(name, data)
    const users = await client.presence.getAll()
} catch (e) {
    console.log('Error occurred', e)
}
```

- Listening

The listening API has been ever so slightly tweaked in order to simplify removing an active subscription.

Before when an active provider was started you would usually need to store it in a higher scope, for example:

```typescript
const listeners = new Map()

client.record.listen('users/.*', (name, isSubscribed, ({ accept, reject }) => {
    if (isSubscribed) {
        const updateInterval = setInterval(updateRecord.bind(this, name), 1000)
        listeners.set(name, updateInterval)
        accept()
    } else {
        clearTimeout(listeners.get(name))
        listeners.delete(name)
    }
})
```

Where now we instead do:

```typescript
const listeners = new Map()

client.record.listen('users/.*', (name, ({ accept, reject, onStop }) => {
    const updateInterval = setInterval(updateRecord.bind(this, name), 1000)
    accept()

    onStop(() => clearTimeout(updateInterval))
})
```

## TLDR:

## Binary Protocol

`markdown:release-4.0-protobuf-protocol.md`

## Offline Storage

Offline storage is probably the biggest feature in 4.0. So I'm really happy to say it has been added. But offline storage is one of the hardest things we worked on due to the insane amount of states it introduces. So it's with a bit of regret that I say you should not use it if you want to immediately go into production! What would be extremely helpful is if you have it enabled in development incase you run into issues, and hopefully once all small glitches are resolved I'll release a 4.1 with it being officially production ready. *If you are using a data pattern where you don't have to do updates via deepstream (only consuming message for visual realtime updates) then ignore that, production ready it is!*

So why use it at all? Because it gives you full record usage without a connection. Pretty slick!

The way offline works is as follows (this is just one path, but most likely):

- User opens app first time, data is requested from server and stored on client side.
- User loses connection to app, but from an app perspective functionality remains the same
- User updates multiple things while offline, sets the record to dirty and updates the value in local storage
- User is back online
- Deepstream requests the version of the record on deepstream. If its the same as the one locally it sends all the modifications as the next update, it it isn't, it requests the data and does a merge conflict.

The reason why it would be production ready for read only scenarios is because the record is never marked as dirty, which means server side always wins:

- User opens app first time, data is requested from server and stored on client side.
- User loses connection to app, but from an app perspective functionality remains the same
- User is back online
- User requests the version of the record on deepstream. If its the same as the one locally it, so doesn't do anything more. If it isn't, it requests the data and assumes its the latest (using a remote wins algorithm).

## Typescript

We converted the majority of the codebase to typescript, for the benefit of future code maintenance as well making it easier for people to contribute. This also means consumers of the SDK can now directly use the generated declaration files
when installing deepstream rather than maintaining separate bindings.

## Services

We added a few services to improve the way things work in the client.

### Timer Service

We now have a timer service that all timers in the sdk are registered against, rather than using the native nodeJS timeouts. This gives us two benefits. First off its just generally much quicker, if you do a CPU profile of native timeouts you'll notice the time used is noticeable, while instead we have a single interval to poll the timeout queue. Secondly it allows us to easily deal with timing slips. What this means is that in the future rather than timeouts being fired much later due to the CPU being blocked, the timer registry can either allow certain timeouts to be ignored or reset.

### Bulk Subscription Service

We now register our subscriptions via a service rather than directly sending a subscription message. This allows us generate a single subscription message for up to thousands of records with a single ack rather than thousands.

### Connection Service

We now have a connection service that is driven by a state machine that can be consumed by any class to send messages as well as listen to any connection lifecycle change.

Current API hooks for reconnection logic are:

```JavaScript
public onLost (() => void): void
public onReestablished (() => void): void
public onExitLimbo (() => void): void
```

For those who looked into the SDK internals before you'll notice the introduction of a limbo state. What this means is the connection was just lost, but you don't want API calls to immediately start failing as a reconnect might be likely to immediately happen. As such feature developers now have the potential of buffering those requests until either the connection is reestablished or the buffer timeout is exceeded and all API calls will fail with a not connected error.
