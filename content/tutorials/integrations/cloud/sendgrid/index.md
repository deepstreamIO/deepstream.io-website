---
title: Sendgrid
description: Integrating Sendgrid with deepstream
tags: [rpcs, sendgrid, realtime, email]
logoImage: sendgrid.png
---
This guide will take you through integrating deepstream with Sendgrid's Email API. If you'd like to dive right into the code you can have a look at the GitHub repository for this tutorial [here](https://github.com/deepstreamIO/dsh-demo-sendgrid-integration).

There are many use cases for sending emails in applications, from reminders to promotional emails and more. We'll be showing how to create a simple `email-provider`, that sends a password reset email for your users when requested. We'll be using the deepstream [JavaScript client SDK](/docs/client-js/client/) and the [Sendgrid SDK for NodeJs](https://github.com/sendgrid/sendgrid-nodejs).

{{> start-deepstream-server}}

## Get started with Sendgrid

The first thing you'll need to do after creating your deepstream account is create a free account over at [Sendgrid](https://www.sendgrid.com/). You'll be taken through a quick guide where you can generate an API key. From here, sending an email is as simple as:

```javascript
cconst sendgrid = require('sendgrid')
const helper = require('sendgrid').mail

const client = sendgrid('<Your Sendgrid API key>')
const from_email = new helper.Email('deepstream@example.com')
const to_email = new helper.Email('<Your email address>')
const subject = 'deepstream & Sendgrid together!'
const content = new helper.Content('text/plain', 'Hello!')
const mail = new helper.Mail(from_email, subject, to_email, content)

const request = client.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
})

client.API(request, (error, response) => {
  // response.statusCode === 202
})
```

## Integrating it with deepstream

{{> glossary rpc=true noHeadline=true}}


Let's next create our `email-provider`, all we need to do is provide an `RPC` method called `password-reset` and whenever it is invoked, send an email prompting the user to reset their password.

We haven't enabled any additional authentication settings so we can just login with open auth, however if you'd like to take a closer look into this, hop on over to our [email](/tutorials/guides/email-auth) and [webhook](/tutorials/guides/http-webhook-auth) authentication tutorials.

```javascript
const client = deepstream('<Your app URL>')
client.login()

client.rpc.provide('reset-password', (data, response) => {
  // send our reset password here
})
```

Let's also quickly write the client side code that invokes the `password-reset` RPC. All we need is a simple form where users can enter their email.

![form](form.png)

With the following JavaScript, we get the data that has been put into the field and invoke the `password-reset` RPC via `client.rpc.make`.

```javascript
const client = deepstream('<Your app URL>')
client.login()

function resetPassword() {
  const email = document.getElementById('name').email
  client.rpc.make('password-reset', email, (error, result) => {
    let msg
    if (error) {
      msg = `An error occurred while sending the password reset email:${error}`
    } else {
      msg = `Password reset email sent successfully, please check your inbox`
    }
    alert(msg)
  })
  return false
}
```

Now we can see that we're passing the email into our `RPC`, we can finish off the code in our `email-provider` process. When sending a password reset email, normal flow is to include a URL that the end user can click, redirecting them to a page where they can enter their new password. We won't be covering that here, we'll just send an email with a mock URL and a unique ID appended to it as our token.

Our `email-provider` now looks as follows:

```javascript
const sendgrid = require('sendgrid')
const deepstream = require('@deepstream/client')
const uuid

const sg = sendgrid('<Your Sendgrid API key')
const helper = require('sendgrid').mail
const client = deepstream('<Your App URL>')
client.login()

const from_email = new helper.Email('info@yourCompany.com')
const subject = 'You\'ve requested a password reset'

client.rpc.provide('password-reset', (email, response) => {
  // this would need to be saved to a db for reference later
  const id = uuid()
  const content = new helper.Content('text/plain', `Hello, ${email}!

It looks like you may have requested a password reset.

Please click the following link to reset your password:

https://www.yourSite.com/password-reset/${id}

Thanks, the team at ${yourCompany}`)

  const to_email = new helper.Email(email)
  const mail = new helper.Mail(from_email, subject, to_email, content)
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  })

  sg.API(request, (error, response) => {
    if (error) {
      response.error(error)
    } else {
      response.send(null)
    }
  })
})
```

And just like that, you have a simple way of sending emails using `RPCs` in deepstream. Thanks for sticking with me. Be sure to check out the other [guides](/tutorials/#guides) and [integrations](/tutorials/#integrations) we have, or check out building something more substantial with deepstream via an [example app](/tutorials/#example-apps).
