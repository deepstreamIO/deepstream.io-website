---
title: Live Progress Bar
description: Learn how to create a Live Progress Bar using deestream
tags: [realtime]
---

Users are impatient. Therefore, if you are going to keep them waiting, they deserve to know why and how long they will wait. It's not just in browsers; a lady in a waiting room would have some sense of feedback if she is given a tag and time slot, instead of leaving her there and just asking her to WAIT.

Spinners provide poor feedback for very long request-response activity. Indefinite progress bars are even worse. What you can do is provide a live progress bar that shows the current status. A situation where you:

- Receive a file
- Process the file
- Upload the file
- Save the file name to a database
- Respond with the file information saved

You will definitely need to let the user know what is happening behind the scenes so as to give them a good reason to wait. We will not do all that in our example, rather, we will simulate the time it takes to do each of them using `setTimeout`.

In each of the `setTimeout` async functions, you can send realtime updates to the client informing her about what's ongoing on the server and why she is yet to receive a response.

Let's see some code!

## Serverless Server

The title is twisted but, yeah, that's what it is. The "severless" concept does not imply that servers do not exist, but the details about the server do not need to be known by they developer. Just write your code and deploy. In this example, we will make use of [Webtask](https://webtask.io) as our serverless platform.

- Install Webtask:

```bash
npm install wt-cli
```

- Create a [Webtask Account](https://webtask.io)
- Create an `inde.js` in the root of an empty project folder with:

```js
// ./index.js
var Express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var app = Express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({text: 'hi'})
})

module.exports = Webtask.fromExpress(app);
```

- Run the app:

```bash
wt create
```

Visit the URL logged to the console and expect the following response body:

```js
{text: 'hi'}
```

## deepstream for Realtime Events
At each stage while processing the request, we hope to send realtime updates to the client. deepstream is a great choice; it allows you to send realtime events (with payload) without having to setup anything. 

Once you have a server setup you can login.

```js
// ./index.js
...
// Import deepstream
var deepstream = require('deepstream.io-client-js');
var app = Express();

// Connect with App URL
var client = deepstream('localhost:6020')
client.login();
```

### Emitting Events

With deepstream setup, it's time to simulate a long request and send out realtime events for each of the completed stages:

```js
app.post('/post', (req, res) => {
  var postProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:15, msg: 'Posting...'})
        resolve({done: true})
      }, 1000)
    })
  }

  var receiveProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Receiving...'})
        resolve({done: true})
      }, 2000)
    })
  }

  var processProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Processing...'})
        resolve({done: true})
      }, 1000)
    })
  }

  var completeProgressPromise = function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.event.emit('progress', {slot:30, msg: 'Completing...'})
        resolve({done: true})
      }, 1000)
    })
  }

  var endProgressPromise = function() {
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

## Frontend with Vue

Let's see how we can consume our API and effectively use it to build an engaging user experience. Vue is easy to setup in any environment, let's use it to quickly make a simple frontend:

```js
var client = deepstream('<App-URL>').login();

var App = new Vue({
  created: function() {
    client.event.subscribe('progress', (p) => {
      this.disabled = true
      this.resValue += p.slot;
      this.resStatus = p.msg;
    })
  },
  data: function() {
    return {
      resValue: 0,
      resStatus: 'Post to Server',
      disabled: false
    }
  },
  computed: {
    showProgress: function() {
      return this.resValue > 0 && this.resStatus !== 'Post to Server'
    }
  },
  methods: {
    postToServer: function() {
      axios.post('https://wt-nwambachristian-gmail_com-0.run.webtask.io/realtime-progress/post', {}).then((res) => {
        console.log(res.data.status)
        this.resStatus = res.data.status
        setTimeout(() => {
          this.resValue = 0;
          this.resStatus = 'Post to Server'
          this.disabled = false
        }, 2000)
      })
    }
  }
})

App.$mount('#app')
```

- When the Vue app is instantiated, we hook into the `created` lifcycle method, subscribe to the `progress` events being emitted by the sever and bind the values coming in to our view
- The post request is triggered on clicking a button. We use Axios to simplify the HTTP request. When the request is done, we rest all values to their defaults.

Below is the HTML for the above example:

```html
<div id="app">
  <div class="container">
    <div class="actions">
      <div>
        <progress max="100" :value="resValue" v-show="showProgress"></progress>
        
      </div>
      <button :disabled="disabled" @click="postToServer">{{resStatus}}</button>
    </div>
  </div>
</div>
```