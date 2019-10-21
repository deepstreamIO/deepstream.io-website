---
title: AWS SNS
description: Integrating deepstream with AWS SNS
tags: [AWS, SNS, deepstream, events, publish, subscribe]
logoImage: aws-sns.png
---

This guide will take you through integrating with deepstream with Amazon Web Service's Simple Notification Service.

With SNS we can send the same message to Smartphones, Email inboxes and VoIP clients, however there's currently no easy way to send these messages to web browsers.

In this quick guide we'll show you how to do this with deepstream, we'll be using the [JavaScript client SDK](/docs/client-js/client/) and the [AWS client sdk for NodeJs](https://aws.amazon.com/sdk-for-node-js/).

`markdown:setting-up-deepstream.md`

## The basic setup

In this tutorial, we’ll build a “sns-provider”, a node process that subscribes to a SNS topic and forwards its messages as deepstream events. For this to work, our provider needs to:

-Authenticate against AWS

-Become a SNS HTTP endpoint

-Subscribe to a SNS topic

-Connect to deepstream

-Forward incoming messages as deepstream events

This looks like a lot, but we'll be able to accomplish with a relatively small amount of code. If you prefer diving right into the code, check out the [github](https://github.com/deepstreamIO/demos-js/tree/master/aws/sns) repo. Here's a high level overview of what our setup will look like.

![setup-overview](setup-overview.png)

For brevities sake, this tutorial skimps on security. AWS security is extremely powerful, but also complex enough to have whole books written about it. We’ll be using http instead of https and temporary security tokens (which is a good idea), but store them as plain text in our code (which is not). This tutorial also assumes that you're already familiar with deepstream's basic concepts. If not, quickly head over to the getting started [tutorial](/tutorials/getting-started/node) - don't worry, I'll wait.

## Let’s get started: Creating a topic.
We’ll start by creating a topic via the AWS console. Topics are the fundamental concept for message routing in a pub-sub architecture: Many subscribers listen to a topic and are notified whenever something publishes a message on that topic. Basically, it’s like JavaScript events, but you have to create a topic before you can subscribe. Let’s create a topic called “news” via the console:

![create-sns-topic](create-sns-topic.png)

## Create the http server
Next up, we'll create a simple HTTP server. Why? The way SNS notifies your application of incoming messages is via HTTP. For this to work, your application needs to:

-Start a HTTP server

-Subscribe to a topic and tell SNS which URL it should send updates to

-Receive a “do you really want to receive updates?” message on that URL

-Confirm that message

And from there on, it receives all updates as incoming http requests. A few things to note about these requests:

-All incoming requests are POST requests

-The message data is JSON encoded

-Each message contains a " x-amz-sns-message-type” header that tells you which kind of message it is (e.g. “SubscriptionConfirmation” or “Notification”)

With this in mind, we can create an HTTP server like the following:

```javascript
const server = new http.Server()
server.on('request', (request, response) => {
  request.setEncoding( 'utf8' )

  //concatenate POST data
  let msgBody = ''
  request.on('data', (data) => {
    msgBody += data
  })
  request.on( 'end', function(){
    const msgData = JSON.parse(msgBody)
    const msgType = request.headers['x-amz-sns-message-type']
    handleIncomingMessage(msgType, msgData)
  })

  // SNS doesn't care about our response as long as it comes
  // with a HTTP statuscode of 200
  response.end('OK')
})

server.listen(3000)
```

We'll also need to make this HTTP server accessible via the internet, we'd recommend running something like `ngrok HTTP 3000` to accomplish this.

## Subscribing to a topic

Using the AWS-SDK for Node.js, subscribing to a topic is as easy as:

```javascript
const AWS = require('aws-sdk')
const sns = new AWS.SNS()

sns.subscribe({
    Protocol: 'http',
    // You don't just subscribe to "news", but the whole Amazon Resource Name (ARN)
    TopicArn: 'arn:aws:sns:eu-central-1:277026727916:news',
    Endpoint: 'http://your-endpoint-url.com'
}, (error, data) => {
    console.log(error || data)
})
```
But for this to work, we need to get two security steps out of the way first: Permission a user to use SNS and add its credentials to the Node SDK.

Here's how to permission a user via the AWS console:

![attaching-SNS-policy](attaching-SNS-policy.png)

Next, we need to create a security token for this user. Using the AWS command line tool this is as simple as:

```bash
aws sts get-session-token
```

This will display a set of credentials that we can use to configure our SDK.

```javascript
const AWS = require('aws-sdk')
AWS.config.update({
  "secretAccessKey": "...",
  "sessionToken": "...",
  "accessKeyId": "...",
  "region": "eu-central-1"
})
const sns = new AWS.SNS()
```

As mentioned before, embedding your credentials into the code might be easy, but it isn't safe. Have a look at the [config documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html) to find a better way to store credentials.

## Confirming your subscription
Great, now our call to `sns.subscribe` should work. A few milliseconds after we've made it, our express server should receive a message, asking it to confirm the subscription. To process it, it's time to fill in the `handleIncomingMessage(msgType, msgData)` method from the HTTP server snippet.

```javascript
const handleIncomingMessage = (msgType, msgData) => {
    if( msgType === 'SubscriptionConfirmation') {
        //confirm the subscription.
        sns.confirmSubscription({
            Token: msgData.Token,
            TopicArn: msgData.TopicArn
        }, onAwsResponse );
    } else if ( msgType === 'Notification' ) {
        // That's where the actual messages will arrive
    } else {
        console.log( 'Unexpected message type ' + msgType );
    }
}
```

All that's left now is to connect our SNS-provider to the deepstream server:

```javascript
const { DeepstreamClient } = require('@deepstream/client')
const client = deepstream('<Your app URL>')
client.login()
```

## Forwarding SNS messages as deepstream events

Ok, time for the last piece of the puzzle. Every time we receive a message from SNS, we want to forward it as a deepstream event. (Events are deepstream's pub-sub mechanism. They work exactly like a JavaScript event emitter, distributed across many clients).

Each SNS message has a "Subject" and a "Message" - both of which are plain text. This leaves us with a couple of choices: We could use the topic as an event name, send JSON as the message body or come up with a totally different mechanism. But for now, let's keep things simple: Every time we receive a message, we'll use the Subject as an event-name and send the message content as event-data... or in code, inside our handleIncomingMessage method:

```javascript
else if (msgType === 'Notification') {
    client.event.emit(msgData.Subject, msgData.Message)
}
```

Subscribing to this event from a browser is now as easy as:

```javascript
client.event.subscribe('someEvent', (data) => {
    console.log(data)
})

```
And that's it. Thanks for holding out with me for so long. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
