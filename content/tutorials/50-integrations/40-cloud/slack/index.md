---
title: Slack
description: Integrating Slack with deepstream
tags: [slack, realtime, messaging, events]
logoImage: slack.png
---

This guide will take you through integrating deepstream with Slack's Incoming Webhook API. If you'd like to dive right into the code you can have a look at the GitHub repository for this tutorial [here](https://github.com/deepstreamIO/dsh-demo-slack-integration).

There are many use cases for sending messages to Slack in applications, from reminders and alerts and more. We'll be showing you how to create a simple form where users can send feedback to a slack channel. We'll be using the deepstream [JavaScript client SDK](/docs/client-js/client/) and the [Slack SDK for NodeJs](https://github.com/twilio/twilio-node).


{{> start-deepstream-server}}


## High level overview

We'll need a couple of things to start this tutorial:

- a backend process powered by deepstream that sends messages to Slack

- a simple form to send data this process

- a webhook integration set up in Slack

## Get started with Slack


The first thing you'll need to do after creating your deepstream account is create a team at [Slack](https://slack.com/). After [creating a channel](https://get.slack.help/hc/en-us/articles/201402297-Create-a-channel) that we'll name `feedback`, you'll need to create an [Incoming Webhook](https://api.slack.com/incoming-webhooks#customizations_for_custom_integrations) integration that we can use to send messages to the channel.

![incoming-webhook](incoming-webhook.png)

This will give you a Webhook URL that you can use to send messages with as follows:

```javascript
const IncomingWebhook = require('@slack/client').IncomingWebhook

const webhook = new IncomingWebhook(<Your webhook URL>, {
  username: 'Feedback Bot',
  channel: 'feedback'
})

webhook.send('Hello world!', (err, res) => {
  if (err) {
      console.log('Error:', err);
  } else {
      console.log('Message sent: ', res);
  }
})
```

Running the above code will send the message `Hello world!` to our new feedback channel, integrating it with deepstream and making it realtime is now easy.

## Integrating it with deepstream

{{> glossary event=true noHeadline=true}}



Let's next create our `feedback-provider`, a lightweight process that we can use to receive events from the frontend and create the webhooks on demand. All we need to do is subscribe to an `Event` called `feedback` and whenever a `feedback` event is received, create the webhook with the payload received.

```javascript
client.event.subscribe('feedback', (data) => {
  webhook.send(data, (err, res) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Message sent: ', res);
    }
  })
})
```

Finally we can write the client side code that emits the `feedback` event. All we need is a simple form where we can enter the feedback.

![form](form.png)

With the following JavaScript, we get the data that has been put into the field and emit the event via `client.event.emit`.

```javascript
const client = deepstream('<Your app URL>')
client.login()

function submitFeedback() {
  const feedback = document.getElementById('feedback').value
  client.event.emit('feedback', feedback)
  alert('Thanks for your feedback!')
}
```

After doing this, assuming you entered the feedback `Loving your site!` you should have received a Slack message like this:

![slack](slack.png)

And that's it. Thanks for sticking with me. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
