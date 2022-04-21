---
title: Events
---

Events are deepstream's implementation of the "publish/subscribe" or "observer" pattern. If you're familiar with e.g. JavaScript event-emitters or Java events, you know how they work. Zero or more interested clients subscribe to an event (sometimes also called a "topic", "channel" or "namespace") and zero or more other clients publish to it.

![Pub/Sub diagram](pubsub-diagram.png)

The emphasis on "zero or more" underlines one of the main characteristics of pub/sub: Publishers and subscribers are completely decoupled. It's a bit like a newspaper - journalists write articles assuming but not knowing that they will be read, and readers open the sports section expecting but not knowing that something they care about will be written on it.

This decoupling makes pub/sub scalable and fault tolerant, but sometimes you want to know if there's someone out there waiting for your messages. For that, deepstream's events come with a feature called "listening".

## Pub/Sub and its limitations
Due to its simplicity and versatility, pub/sub is the most widely adopted pattern for realtime systems with many hosted (e.g. [Pusher](https://pusher.com/), [PubNub](https://www.pubnub.com/)), server-to-client (e.g. [socket.io](http://socket.io/), [SocketCluster](http://socketcluster.io/#!/)) or server-to-server (e.g. [Redis](https://redis.io/topics/pubsub), [Kafka](http://kafka.apache.org/)) solutions available.

However, pub/sub is purely a lightweight way of messaging, but doesn't have any concept of persistence or state. It's therefore often used to notify clients of changes which in turn trigger a separate HTTP request to retrieve the actual data.

This comes with significant overhead and is increasingly abandoned in favour of "data-sync", an approach where the actual data is distributed and kept in sync across all subscribed clients. Data-sync is one of deepstream's core features and can be used in the form of [records](/docs/tutorials/core/datasync/records/).

Having said that, pub/sub vs data-sync doesn't need to be an either/or decision. Both complement each other well and can be used together for many use cases.

## How to use events

Subscription to events can be established with `client.event.subscribe` and removed with `client.event.unsubscribe`.

```javascript
// Client A
function eventCallback(data) {
	//callback for incoming events
}

//Subscribing to an event
client.event.subscribe('news/sports', eventCallback)

//Removing specific callback to the event
client.event.unsubscribe('news/sports', eventCallback)

//Removing all subscriptions to the event
client.event.unsubscribe('news/sports')
```

Events can be published using `client.event.emit(eventName, data)`. It's possible to send any kind of serializable data along with the event, e.g. Strings, JSON objects, Numbers, Booleans etc.

```javascript
// Client B
client.event.emit('news/sports', 'football is happening')
```

## How to listen for event subscriptions
deepstream allows clients to "listen" for other clients' event subscriptions. This is useful to create "active" data providers that only emit events if they are actually needed.

Listeners can register for a pattern described by a regular expression, e.g. `'^news/.*'`.

```javascript
// Client B
client.event.listen('^news/.*', (match, response) => {
  console.log(match) // 'news/sports'
  if (/* if you want to provide */) {
    // start publishing data via `client.event.emit(eventName, /* data */)`
    response.accept()

    response.onStop(() => {
      // stop publishing data
    })
  } else {
    response.reject() // let deepstream ask another provider
  }
})
```

The listen-callback is called once the first client subscribes to a matching event and `onStop` is called once the last subscriber for a matching event unsubscribes.

Listening also keeps state. Registering as a listener for a pattern that already has matching subscriptions without an active provider will call the callback multiple times straight away, once for every matching subscription.
