---
title: Getting started with HTTP
description: Learn how to start a server and interact with a HTTP API
state: incomplete
---

This guide will introduce deepstream's HTTP interface, and show how it can be used to access
Records, Events, RPCs and Presence.

The first thing you'll need to access the HTTP API is your application's unique HTTP URL.

## Start the server

Let's start by installing the server. Just pick the [right version for your operating system](/install/) and follow its steps. Once the server is installed, you can start it with:

```bash
deepstream start
```

To see how it works in real-time we can set up a javascript WebSocket client. To get that setup,
take a look at the [getting started with javascript](/tutorials/getting-started/javascript)
tutorial.

## Events (publish-subscribe)

We'll use the JS client to subscribe to the event 'test-event':

```javascript
ds.event.subscribe( 'test-event', function( eventData ){ 
  console.log( eventData );
});
```

... and now we can publish events using an HTTP client, such as [jQuery.ajax](http://api.jquery.com/jquery.ajax/):

```javascript
const requestBody = {
  body: [{
    topic: 'event',
    action: 'emit',
    eventName: 'test-event',
    data: { some: 'data' }
  }]
};

const url = '<YOUR HTTP URL>';

$.ajax({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  url: url,
  data: JSON.stringify(requestBody)
}).done(function (response) {
  console.log('The request was a', response.result);
});
```

... or cURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "body": [{
    "topic": "event",
    "action": "emit",
    "eventName": "test-event",
    "data": "some test data"
  }]
}' "<YOUR HTTP URL>"
```

For more information see [deepstream HTTP docs](/docs/http/v1).
