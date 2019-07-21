---
title: AWS Lambda
description: Integrating deepstream's HTTP API with AWS Lambda
tags: [http, lambda, deepstream, record, event, rpc]
logoImage: aws-lambda.png
draft: true
---

[Amazon Web Service's Lambda](https://aws.amazon.com/lambda/) functions are a great way to deploy external and internal functionality at a low cost. Because you only pay for what you use, Lambda is suited perfectly to short lived functions. With the introduction of deepstream's HTTP API, we no longer need to spend the time setting up a websocket connection, so we can get straight to sending data.

The Getting Started guides for Lambda have a lot of nice examples showing different ways to do things. This image shows an example pipeline for processing images in your application architecture.

![AWS Example](aws-example.png)

We'll be doing something similar with deepstream, which is a great facilitator for broadcasting updates and data to many connected clients.

Internally at deepstream we have a lot of infrastructure and many tools to help us with deployments and metrics. When we deploy there are a few shareholders who want to know about it:

- the developer responsible for the release
- a QA who will make sure everything is working as expected
- a DevOps team member

We have rolling deploys which ensure that the release is working as expected on each machine before the next one starts draining connections. However it's always nice to verify everything is working.

In this tutorial we'll be showing how to set up a pipeline like the following:

![DSH Example](dsh-lambda.png)

Whenever a deploy commit is made, a build will be triggered on Travis-CI which then uploads the artifacts to S3. Once these have been uploaded our Lambda function will be run, notifying any interested deepstream clients.

We could use another event in our deployment pipeline (such as a tag on GitHub being pushed, the Travis-CI build passing, or a successful deploy via [Code Deploy](https://aws.amazon.com/codedeploy/)), but using the S3 upload is the quickest win for us as AWS offers S3 uploads as an integration point to Lambda.

### Let's create the Lambda function

The first thing we need to do is create our Lambda function with an S3 upload trigger. I'll be the first to admit that setting up Lambda with an API Gateway can be tricky, however you shouldn't have any trouble with the S3 integration. We want the Lambda function to be run on any upload to your artifact bucket.

![1](1.png)

Make sure when setting it up that you configure your `HTTP_URL` environment variable - this is the URL that we'll be using to send data to deepstream.

![http-url](2.png)

Once this has been set up, we can add some code. I'd definitely recommend using your text editor or IDE for editing the code, it's much easier than the editor AWS provides.

For ease of making HTTP requests, we'll be depending on the library [needle](https://github.com/tomas/needle). Our function is very small, and all it does is emit an event on the `deployment` topic when a deploy is made with:

- the bucket the item was uploaded to (normally the name of the service/project)
- the name of the item uploaded (usually the version number or other identifier).

```javascript
const needle = require('needle')

exports.handler = (event, context, callback) => {
  const repository = event.Records[0].s3.bucket.name
  const version = event.Records[0].s3.object.key
  // format needed to send HTTP requests
  // in deepstream
  const body = [{
    topic: 'event',
    action: 'emit',
    eventName: 'deployment',
    data: {
      version,
      repository
    }
  }]

  needle.post(process.env.HTTP_URL, { body }, { json: true }, (error, response) => {
    if (error || response.body.result !== 'SUCCESS') {
      console.log('Unable to emit event', response.body.toString())
      return callback()
    }
    callback(null, { statusCode: 200 })
  })
}
```

All we're doing here is getting the name of the bucket and the item name from the S3 event, creating the payload needed for our deepstream event and sending it via needle.

If you receive a `"Cannot find module '/var/task/index'"` error while trying this, make sure that your directory structure is as follows:

```bash
- lambda-test
  - index.js
  - node_modules
```

You can then use the following script to ZIP up the folder correctly:

```bash
zip -r ../lambda-test.zip *
```

### Receive the data

Now that we're broadcasting data on updates, we just need to subscribe some clients to the `deployment` topic so that they get notified during a deployment.

Let's imagine that we're deploying version `1.2.3` of our `dsh-admin-endpoint`. With the [JavaScript SDK](/docs/client-js/client/) we could get updates as follows:

```javascript
const client = deepstream('<Your App URL>')
client.login()

client.event.subscribe('deployment', { repository, version } => {
  console.log(`Version ${version} of ${repository} was just deployed to production`)
  // Version 1.2.3 of dsh-admin-endpoint was just deployed to production
})
```

This gets even better when using mobile applications - we have an app which we use internally that looks as follows:

![android](android-cropped.png)

This allows our engineers to dynamically register themselves to deployments they are interested in. The code for the app is very simple and looks a bit like this:

```java
DeepstreamClient client = new DeepstreamClient("<Your app URL>");
client.login();

ToggleButton toggle = (ToggleButton) findViewById(R.id.togglebutton);
toggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
  public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
    if (isChecked) {
      client.event.subscribe("deployment", new EventListener() {
        public void onEvent(String eventName, Object data) {
          // build and display the notification
        }
      });
    } else {
      client.event.unsubscribe("deployment");
    }
  }
});
```

And there we have it, that's how you can set up a simple AWS Lambda function to send events to your connected devices. We have tutorials on integrating deepstream with [Slack](/tutorials/integrations/slack), [SendGrid](/tutorials/integrations/sendgrid), [Twilio](/tutorials/integrations/twilio) and more, which means deepstream can be the centre of your architecture and fan out updates wherever you need.
