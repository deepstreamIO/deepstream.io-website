---
title: Twilio
description: Integrating Twilio with deepstream
tags: [phone-calling, realtime, rpcs, twilio]
logoImage: twilio.png
---
This guide will take you through integrating deepstream with Twilio's Programmable Voice API. If you'd like to dive right into the code you can have a look at the GitHub repository for this tutorial [here](https://github.com/deepstreamIO/demos-js/tree/master/integration/twilio).

There are many use cases for creating calls in applications, from reminders to voice messages and more. We'll be showing how to create a simple call-provider that calls numbers when requested. We'll be using the deepstream [JavaScript client SDK](/docs/client-js/client/) and the [Twilio SDK for NodeJs](https://github.com/twilio/twilio-node).

In this tutorial, we'll be creating a simple form where we can create personalised calls to invite people to a party, that will then afterwards play Never Gonna Give You Up by Rick Astley.

{{> start-deepstream-server}}

## High level overview

To create a phone call in Twilio we need to provide three things, a `fromNumber`, a `toNumber` and a `url`. It might look a bit strange that we have to provide a URL to make a phone call, however this URL will have an HTTP POST sent to it once the call is established, with the response being what is said to the recipient. Usually we'd need to set up a simple server that would provide the custom XML we need, however Twilio also provides a way to do this via `TwiML Bin` - a place where they host snippets of XML for you.

We'll be using a back end process powered by deepstream to handle requests and create calls based on an XML configuration hosted in `TwiML Bin`.

## Get started with Twilio

The first thing you'll need to do after creating your deepstream account is create a free account over at [Twilio](https://www.twilio.com/). You'll need to get a [registered phone number](https://www.twilio.com/console/phone-numbers/incoming) that you can create calls from, however Twilio makes this easy with the $15.50 free credit they give you. This will give you an accountSid and authToken that we can use to get started with.

```javascript
const accountSid = '<Your Twilio SID>'
const authToken = '<Your Twilio auth token>'
const twilio = require('twilio')(accountSid, authToken)
```

Creating a call via the Twilio SDK is now as easy as:

```javascript
twilio.calls.create({
    url: '<XML response url>',
    to: '<To phone number>',
    from: '<Registered phone number>'
}, (err, call) => {
    console.log(err, call)
})
```

After this we can use TwiML Bin, to create an XML response as follows:

![twiml](twiml.png)

The `url` you're provided with after clicking `create` will be the `url` you need to provide when calling `twilio.calls.create`.

## Integrating it with deepstream

{{> glossary rpc=true noHeadline=true}}

Let's next create our `call-provider`, all we need to do is provide an `RPC` method called `phone-call` and whenever it is invoked, create a phone call to the number given to us.

Earlier, in the XML snippet we created with `TwiML Bin`, we specified the variables `Name` and `Day`. Here we're just passing these into the query string of our URL, Twilio takes care of the rest.

```javascript
const client = deepstream('<Your app URL>')
client.login()

client.rpc.provide('phone-call', (data, response) => {
  const { name, day, number } = data
  twilio.calls.create({
    url: `<TwiML Bin URL>?Name=${name}&Day=${day}`,
    to: number,
    from: '<Registered phone number>'
  }, (err, call) => {
    if (err) {
      response.error(err)
    } else {
      response.send(null)
    }
  })
})
```

Finally we can write the client side code that invokes the `phone-call` RPC. All we need is a simple form where we can enter the name and number for the person we want to invite to our party, as well as the day of the party.

![form](form.png)

With the following JavaScript, we get the data that has been put into the fields and invoke the `phone-call` RPC via `client.rpc.make`.

```javascript
const client = deepstream('<Your app URL>')
client.login()

function call() {
  const name = document.getElementById('name').value
  const number = document.getElementById('number').value
  const day = document.getElementById('day').value
  client.rpc.make('phone-call', { name, number, day }, (error, result) => {
    let msg
    if (error) {
      msg = `An error occurred while sending the invite:${error}`
    } else {
      msg = `Invite sent successfully`
    }
    alert(msg)
  })
  return false
}
```

After this you should receive a phone call that invites you to a party, followed by Never Gonna Give You Up by Rick Astley.

And that's it. Thanks for sticking with me. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
