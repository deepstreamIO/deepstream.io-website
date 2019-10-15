---
title: Emitting events
description: "Step three: Emitting events as the post progresses"
---

With deepstream setup and an open connection, it's time to simulate a POST handler that takes a long time and send out realtime events for each of the completed stages.

Events in deepstream is very similar to the normal JS event emitter. You can emit, subscribe, unsubscribe and do some extra magic we'll skip for now!

### Events


```javascript
function eventHandler (...args) {
  console.log('event received with data', ...args)
}

// Subscribe to an event across the deepstream cluster
client.event.subscribe('event-name', eventHandler)

// Emit an event out to the deepstream cluster (and locally)
client.event.emit('event-name', { timestamp: Date.now() })

// Unsubscribe to the event across the deepstream cluster
client.event.unsubscribe('event-name', eventHandler)
```

### Express Post Route

```javascript
// A small util function to make code easier to read
const PromiseDelay = delay => new Promise(resolve => setTimeout(resolve, delay))

app.post('/post', (req, res) => {
  const postProgressPromise = async function() {
    // The delay simulates time taken for a task to complete
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:15, message: 'Posting...'})
    resolve({done: true})
  }

  const receiveProgressPromise = async function() {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:30, message: 'Receiving...'})
    resolve({done: true})
  }

  const processProgressPromise = await function() {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:45, message: 'Processing...'})
    resolve({done: true})
  }

  const completeProgressPromise = function() {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:60, message: 'Completing...'})
    resolve({done: true})
  }

  const endProgressPromise = async function() {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:100})
    resolve({done: true})
  }

  postProgressPromise()
    .then(receiveProgressPromise)
    .then(processProgressPromise)
    .then(completeProgressPromise)
    .then(endProgressPromise)
    .then(() => res.json({status: 'Completed'}))
})
```

After a second or two (which is a simulating a real live long request), we emit a deepstream event. These events are sent with payload containing the percentage estimate and the feedback message for the client.
