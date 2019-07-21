---
title: Pusher
description: Integrating Pusher with deepstream
tags: [pusher, deepstream, integration, events, realtime]
logoImage: pusher.png
---
This guide will take you through integrating deepstream's events with Pusher's event system. If you'd like to dive right into the code you can have a look at the GitHub repository for this tutorial [here](https://github.com/deepstreamIO/demos-js/tree/master/integration/pusher).

Whether you have legacy components using Pusher and you're moving towards deepstream, or you want the additional features deepstream provides on top of an event system, integrating deepstream and forwarding events is easy. We'll be using the deepstream [JavaScript client SDK](/docs/client-js/client/), the [Pusher client SDK for JavaScript](https://github.com/pusher/pusher-js) and the [Pusher server SDK for JavaScript](https://github.com/pusher/pusher-http-node).

{{> start-deepstream-server}}

## Connecting to deepstream

Getting started and logging into deepstream is easy with the client SDKs. We provide a few different methods of authentication, such as [email](/tutorials/guides/email-auth) and [HTTP webhook](/tutorials/guides/http-webhook-auth) authentication. This means that we can easily get started with sending and receiving (publishing and subscribing, if you will) data between clients. In this tutorial we'll just be using [open](/tutorials/guides/open-auth) authentication, which means we can login without credentials, i.e. `client.login()`.

However to follow along with the Pusher side of this tutorial, you'll need to set up a small web server to authenticate users. If you'd like to take a look at this, have a look at the repository code.

## Forwarding an event from Pusher

The Pusher API for publishing events [differs between the client and server](https://pusher.com/docs/client_api_guide/client_events#trigger-events); with deepstream it's the same on both so we only need to write a little bit of code. A common example would be where a Pusher client is sending notifications to other clients and we want to notify the deepstream clients as well.

To do this we'll just need a simple back-end process that converts the Pusher events to deepstream events. In Pusher, events from clients need to be prefixed with `client-`, so we'll bind to the `client-notification` topic and whenever we receive a message on that topic, forward it to our deepstream clients.

```javascript
const Pusher = require('pusher-js/node')
const deepstream = require('@deepstream/client')

client.login()

const pusher = new Pusher(config.key, { ... })

const channel = pusher.subscribe('private-my-channel')
channel.bind('client-notification', (data) => {
  client.event.emit('notification', data)
})
```

Now any deepstream client that is subscribed to the `notification` topic as follows is able to receive events from Pusher.

```javascript
const deepstream = require('@deepstream/client')

client.login()

client.event.subscribe('notification', (data) => {
  // do something with data
})
```

We could take this even further as well and ignore the channel the message comes from. By binding to the `Pusher` object itself, on any `client-notification` event we can forward it to deepstream clients as follows.

```javascript
pusher.bind('client-notification', (data) => {
  client.event.emit('notification', data)
})
```

## Sending deepstream events alongside Pusher

Another common use case is to have some back end process sending events to interested clients periodically. While you're migrating the Pusher clients to deepstream, you can easily start sending the events via deepstream as follows.

```javascript
const deepstream = require('@deepstream/client')
const Pusher = require('pusher')

const client = deepstream('<Your app URL>')
client.login()

const pusher = new Pusher({ ... })

// when something happens

client.event.emit('notification', data)

pusher.trigger('private-my-channel', 'client-notification', data)
```

And then as above, any clients (back end processes, browser based users or IoT devices) can be informed of the event as we demonstrated earlier.

```javascript
client.event.subscribe('notification', (data) => {
  // do something with data
})
```

And that's it. Thanks for sticking with me. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
