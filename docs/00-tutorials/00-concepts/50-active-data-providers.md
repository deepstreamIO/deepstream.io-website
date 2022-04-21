---
title: Active Data Providers
---

What are Data Providers?

Data Providers are processes that feed data into deepstream. Technically, they are just regular deepstream clients that usually run on the backend and write to records, send events or provide RPCs.

#### Example
Imagine you're building an application that shows stock prices from various exchanges from around the world. For each exchange, you'd build a process that receives data and forwards it to deepstream.

![Data Providers](/img/tutorials/00-concepts/data-providers.png)

#### The Problem
Nasdaq alone can send out tens of millions of price updates every day, and it's not much different for other stock exchanges. This can put an unsustainable load on your infrastructure and can lead to high bandwidth costs.

Even worse: Most updates might be for stocks that no client is subscribed to and won't be forwarded at all.

#### The Solution: Active Data Providers
Only write to records / send events that clients are interested in. deepstream supports a feature called `listening` that lets clients listen for event or record subscriptions made by other clients. First, the listener registers for a pattern, e.g. `nasdaq/.*`. Then it will be notified once the subscription is removed via the `onStop` callback.

```javascript
client.record.listen('nasdaq/.*', (match, response) => {
  // Start providing data
  response.accept()

  response.onStop(() => {
    // stop providing data
  })
})
```

This allows you to create efficient providers that only send out the data that's currently needed.

![Active Data Providers](/img/tutorials/00-concepts/active-data-providers.png)