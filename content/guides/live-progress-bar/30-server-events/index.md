
### Emitting Events

With deepstream setup, it's time to simulate a long request and send out realtime events for each of the completed stages:

```javascript
app.post('/post', (req, res) => {
  const postProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:15, msg: 'Posting...'})
        resolve({done: true})
      }, 1000)
    })
  }

  const receiveProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Receiving...'})
        resolve({done: true})
      }, 2000)
    })
  }

  const processProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Processing...'})
        resolve({done: true})
      }, 1000)
    })
  }

  const completeProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Completing...'})
        resolve({done: true})
      }, 1000)
    })
  }

  const endProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress:end')
        resolve({done: true})
      }, 1000)
    })
  }

  postProgressPromise()
    .then(receiveProgressPromise)
    .then(processProgressPromise)
    .then(completeProgressPromise)
    .then(endProgressPromise)

  client.event.subscribe('progress:end', () => {
    res.json({status: 'Completed'})
  })
})
```

Ignore the [callback hell](http://callbackhell.com/) for now. You can choose to refactor with Promises or whatever async solution makes you a happy coder.

After a second or two (which is a simulating a real live long request), we emit a deepstream event. These events are sent with payload containing the percentage estimate and the feedback message for the client.
