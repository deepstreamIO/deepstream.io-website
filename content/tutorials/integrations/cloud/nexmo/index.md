---
title: Nexmo
description: Integrating Nexmo with deepstream
tags: [text-messaging, realtime, rpcs, nexmo]
logoImage: nexmo.png
---

This guide will take you through integrating deepstream with Nexmo's SMS API. If you'd like to dive right into the code you can have a look at the GitHub repository for this tutorial [here](https://github.com/deepstreamIO/dsh-demo-nexmo-integration).

There are many use cases for sending SMS's in applications, from multi-factor authentication to alerts and more. We'll be showing how to create a simple sms-provider, that sends SMS's when requested. We'll be using the deepstream [JavaScript client SDK](/docs/client-js/client/) and the [Nexmo SDK for NodeJs](https://github.com/Nexmo/nexmo-node).

A common use case for sending SMS's is in restaurants where they send out the shifts each employee has for the week. We'll be creating a simple web form where we can send an employee their shifts for the week.

{{> start-deepstream-server}}

## Get started with Nexmo

The first thing you'll need to do after creating your deepstream account is create a free account over at [Nexmo](https://www.nexmo.com/). This will give you an `apiKey` and `apiSecret` that we can use to get started.

Connecting is as easy as requiring the `nexmo` library and creating new `nexmo` client.

```javascript
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: 'Your Nexmo apiKey',
    apiSecret: 'Your Nexmo apiSecret',
  }, { debug: true }
);
```

Sending an SMS with the library after this is as easy as calling the `sendSms` function.

```javascript
nexmo.message.sendSms(sender, recipient, message, callback)
```

## Integrating it with deepstream

To create a `nexmo-provider`, all we need to do is provide an `RPC` method, and whenever it is invoked, send an SMS.

```javascript
const client = deepstream('<Your app URL>')
client.login()

client.rpc.provide('send-sms', (data, response) => {
  // send our sms here
})
```

We'll first create the client side code that invokes the `send-sms` RPC. All we need is a simple form where we can enter for each employee, their name, number and shifts for the week.

![form](form.png)

With the following JavaScript, we get the data that has been put into the fields and invoke the `send-sms` function via the `client.rpc.make` function.

```javascript
const client = deepstream('Your app URL')
client.login()

function sendSms() {
  const name = document.getElementById('name').value
  const number = document.getElementById('number').value
  const info = document.getElementById('info').value
  client.rpc.make('send-sms', { name, number, info }, (error, result) => {
    let msg
    if (error) {
      msg = `An error occurred while sending the sms ${error}`
    } else {
      msg = 'SMS sent successfully'
    }
    alert(msg)
  })
}
```

Now that we're sending the right data to our sms-provider, we can send the SMS as follows:

```javascript
client.rpc.provide('send-sms', (data, response) => {
  const { name, number, shiftInfo } = data
  nexmo.message.sendSms(
    'Work',
    number,
    `Hi ${name}, your shifts this week are: ${shiftInfo}`,
    (err, res) => {
      if (err) {
        response.error(err)
      } else {
        response.send(null)
      }
    }
  )
})
```

Assuming you used your own number in the `Number` field, you should have received an SMS like this:

![mobile](mobile.png)

And that's it. Thanks for sticking with me. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
