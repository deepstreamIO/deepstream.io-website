---
title: Listening in deepstream
description: Understanding Listening
---

## What is listening?

Listening is a powerful feature provided exclusively by deepstream! However, before we can fully understand how listening works, we first need to understand what data providers are.

Data providers are deepstream's clients that write data to records, send events or provide RPCs. Generally, these providers tend to broadcast all the data they have. Most of the time this means that they are providing a lot of unnecessary data that may not even be required by any clients.

Deepstream's listening feature solves this problem by letting those clients provide only the data that other clients are interested in, which they specify by subscribing to a specific piece of data.

With listening, these data providers can listen to a particular pattern and send data only when any client requires the data referred to by the pattern. 

![concept of listening](listening.png)

If there is more than one data provider that matches the pattern as shown above, deepstream selects one of those randomly. However, a data provider can choose to reject the request for various reasons including load balancing, in which case deepstream will then check if there's any other data provider matching the pattern requested and ask it to provide the data. This is further described in a separate [section](/tutorials/guides/listening/#listening-for-load-balancing/) further down this tutorial.

To understand it better, let's take a look at the following example:

![Usual Approach](usual-pubsub-workflow.png)

As is apparent in the above example, having the weather provider send updates for all the countries, even the ones that the client is not interested in, increases costs as well as the flow of redundant data. This is where listening comes in.

![PubSub with listening](pubsub-with-listening-workflow.png)

As seen above, the amount of data being sent is effectively cut down to just what the client needs. This added efficiency in your pubsub infrastructure reduces the message count on your third party data providers thus cutting you the cost as well. 

Please note that with listening, a data provider starts providing data when the first client subscribes to the data until the last client unsubscribes from the data.

## How to implement listening?

Listening works with events, lists as well as records. 

### Listening with events

In order to implement listening with events, we first make our backend clients(in other words the data providers) listen to a particular pattern, like `weather/*` for the above example.

```javascript
client.event.listen('weather/*', onMatch)
```

The `onMatch` callback function will be called whenever a new event subscription is made or the last subscribed client of an event unsubsribes from that event.

Consider the following:

```javascript
// server.js
const deepstream = require('@deepstream/client')
const client = deepstream('<APP URL>')

client.login({}, (success, data) => {
  if (success) {
    startApp()
  } else {
    console.log('ds login failed')
  }
})

function startApp(){
  client.event.listen('weather/germany/*', onMatch)
}

let interval

function onMatch(subject, isSubscribed, response) {
  if (isSubscribed) {
      response.accept()
      // optionally add a condition to 
      // reject a request with response.reject() 
      interval = setInterval(()=> {
        client.event.emit(subject, "here's your weather data")
      }, 2000)
  } else {
     // if your event is being continously emmitted
     // stop emitting it here
     clearInterval(interval)
  }
}
```

In the above function,

- `subject` is the full path i.e, the event that the client has subscribed to, which in this case will start with `weather/germany/`.

- `isSubscribed` is a boolean variable which can be used to handle subcribe and unsubscribe to events separately i.e, you can use the `isSubscribed` flag to implement whether to start or stop sending the data depending on whether the client has subscribed or unsubscribed to the pattern.

- `response` is an object that comes with two functions, `response.accept()` or `response.reject()`. You can use either one depending on various conditions such as how much is the current data provider loaded, etc.

Let's now see how a client would subscribe to an event that the above data provider is listening to:

```javascript
// client.js
const client = deepstream('<APP URL>')

client.login(() => {
  client.event.subscribe('weather/germany/berlin', (data) => {
    // handle weather data
  })
  setTimeout(() => {
    // unsubscribing after 10 sec for the sake of 
    // simplicity of this tutorial
    client.event.unsubscribe('weather/germany/berlin')
  }, 10000)
})
```

When you execute this app, the following happens:

1. You run the data provider and make it listen to `weather/germany/*`
2. You run the client which will subscribe to berlin's weather using `weather/germany/berlin`
3. Since, this event matches with what the data provider has been listening to, the `onMatch` callback function would be called
4. Inside the `onMatch` function, since the client has subscribed to the event, the data provider would accept the request and start emitting the event every two seconds
5. However, as soon as the client unsubscribes from the event (which here is after a timeout of 10 seconds), the else condition of `isSubscribed` is handled in the `onMatch` function, where we just stop emitting the event.

### Listening with records

Implementing listening with records is easy but it can soon turn complicated if you do not completely understand how records work. So, you might want to go through the documentations for [records](/docs/client-js/datasync-record/) first.

Let's understand this with a small example of using data from the Nasdaq stock market website as our source of data. For simplicity, we will skip the details of how our backend data provider would connect to the Nasdaq database.

Our data provider would look like this:

```javascript
// server.js
const deepstream = require('@deepstream/client')
const client = deepstream('<APP URL>')

client.login({}, (success, data) => {
  if (success) {
    startApp()
  } else {
    console.log('ds login failed')
  }
})

function startApp(){
  client.record.listen('nasdaq/*', onMatch)
}

let interval

function onMatch(subject, isSubscribed, response) {
  if (isSubscribed) {
      response.accept()
      // optionally do response.reject() based on some condition
      interval = setInterval(() => {
        client.record.setData(subject, { price: /* price from Nasdaq stream */ })  
      })
  } else {
    console.log('stopped publishing data')
    clearInterval(interval)
  }
}
```

So, what's happening here is exactly the same as we saw in the previous example of using listening with events in deepstream.

Whenever a client subscribes to a record that starts with `nasdaq/*`, the onMatch callback will be fired and the `isSubscribed` condition will be evaluated to true. The else condition will be executed when the client unsubsribes from this record.

Let's see how the client side code will look like:

```javascript
// client.js
const client = deepstream('<APP URL>')
client.login({}, (success, data) => {
  // subscribing to the record
  const myRecord = client.record.getRecord('nasdaq/msft')
  myRecord.subscribe('price', (data) => {
    // msft data changed
  })
  setTimeout(() => {
    // unsubscribing after 5 seconds
    myRecord.discard(callback)
  },5000)
})
```

Listening with records provides an additional feature called `hasProvider`. This flag tells a client if there is a data provider that exists that is currently listening to the pattern to which the client has subscribed to.

Additionally, a client can also use the `hasProviderChanged` event in order to get notified whenever a data provider changes the state of listening to the particular pattern that the client has subscribed to.

The `hasProvider` and `hasProviderChanged` events are very important and useful in the sense that these are the only ways for a client to know if the data that's available is being obtained in realtime from the providers or is just stale data that was fetched and stored sometime back.

Please note that this feature is only available for records.

### Listening with lists

Lists are collections of record names (not their actual data). To learn more about how they are used, have a look at the [List Tutorial](/tutorials/guides/lists/).

Hence, listening with lists is entirely similar to implementing listening with records as we saw above.

So, here is a sample code for listening with lists, which is pretty much self explanatory.

```javascript
// server.js
const deepstream = require('@deepstream/client')
const client = deepstream('<APP URL>')

client.login({}, (success, data) => {
  if (success) {
    client.record.listen('cars/*', onMatch)
  } else {
    console.log('ds login failed')
  }
})

function onMatch(subject, isSubscribed, response) {
  if (isSubscribed) {
      response.accept()
      // optionally handle response.reject() 
      // handle list subsribe'
  } else {
      // handle list discard
  }
}
```

```javascript
// client.js
const client = deepstream('<APP URL>')

client.login({}, (success, data) => {
  const cars = client.record.getList('cars/honda')
  cars.subscribe((entries) => {
    // handle list entries changed
  })
  setTimeout(() => {
    cars.discard()
  }, 5000)
})
```

## Listening for Load Balancing

As mentioned above, listening is a great way to implement load balancing among the data providers. Let's understand how this works.

Let's say you have multiple data providers which are capable of providing weather data for all the countries in the world. Now consider the worst case scenario where 6 out of 6 times, the deepstream server's random selection of a data provider providing this data happens to be the same. It'll put a lot of load on the single data provider while all the others are idle. We could solve this scenario in two ways:

- If a data provider is already heavily loaded, make it reject the request to provide the data and the deepstream server will then delegate the request to the next randomly chosen data provider that is providing this data.
 
  OR

- You can make these multiple data providers only listen to a non intersecting subset of countries, possibly divided in the alphabetical order of their names. This can further be made even more efficient by combining the above option of having multiple data providers for each of these subsets.

![listening for load balancing](listening-for-load-balancing.png)

As shown in the above figure, listening effectively cuts down load on a single data provider by directly letting you to implement load balancing.


## Using permissions in listening

As with everything else in deepstream, there's a security aspect associated with this feature as well. You can control listening to records and events by specifying `listen:true/false` in the permissions section of the application. 

If a data provider tries to listen to a record or an event that it doesn't have permissions to listen to, it would get an error message saying `message denied`.

To know more about how permissions work in deepstream, visit the [valve docs](/docs/general/valve/) page.

## When can you use listening?

Although listening sounds very fancy, most developers fail to realize the vast variety of use cases it caters to.

You can use listening
- with databases
- with GPS for receiving geolocation coordinates
- with IoT to control the sensors in realtime
and many more!

{{#infobox "info"}}
`listening` allows a data provider to start providing the data whenever a client subscribes to that data. For this reason, the data providers themselves never subscribe to that data. This would put the whole app to work in a loop where the listener is subscribing to the data that it itself is listening. Doesn't make any sense right!

For this reason, the deepstream client API provides the `setData` function (`client.record.setData`). This allows writing to records without subscribing.
{{/infobox}}

## Summary

Listening is a complex feature that can be implemented with simplicity in your deepstream apps. Try listening to cut down the cost and boost the efficiency of your backend processes.
