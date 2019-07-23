---
title: Upgrading the js client
description: Upgrading the deepstream js/node client to V4
---

We tried to keep APIs as consistent as possible on the client, with only two main changes:

### Promise APIs breaks chaining

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

### New listening callback

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
