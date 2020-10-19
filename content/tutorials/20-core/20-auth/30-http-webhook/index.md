---
title: HTTP Authentication
description: How to register your own HTTP server as a Webhook for user authentication
tags: [authentication, webhook, http]
---

Http authentication lets you register your own HTTP server's URL as a Webhook. Every time a user tries to login, deepstream will send their credentials via POST request to your server. Depending on your server's response, the user's login will be denied or granted.

![Webhook Authentication Flow](webhook-flow.png)

Http authentication is the most flexible authentication type as it's completely up to your server to implement an authentication mechanism. You can query a database, contact an oAuth provider, validate a WebToken or whatever else your heart desires.

## Using HTTP Authentication
To enable HTTP authentication, set the `type` to `http` in the `auth` section of the server's [configuration file](/docs/server/configuration/).

```yaml
- type: http
  options:
    endpointUrl: https://someurl.com/auth-user
    permittedStatusCodes: [ 200 ]
    requestTimeout: 2000
    retryStatusCodes: [ 404, 504 ]
    retryAttempts: 3
    retryInterval: 5000
    reportInvalidParameters: true # return when credentials are incorrect: missing username or password
```

In the `options` key, set an `endpointUrl` for an authentication service that deepstream will send a `POST` request to, `permittedStatusCodes` to the list of accepted http codes for successful authentication, and `requestTimeout`is the timeout value (in milliseconds).

[[important]]
| Unless your deepstream and authentication servers are within the same private network, you should use a secure connection (https).

The following payload is sent with the `POST` request for your authentication service to work with.

```json
{
  "connectionData": {...},
  "authData": {...}
}
```

How you construct the service behind the url endpoint is up to you and your application stack, but it should return the relevant http response code and either a `username` string, or a JSON:

```json
{
    "id":"chris",
    "clientData": {},
    "serverData": {}
}
```

The content of `clientData` and `serverData` are up to you, but useful for sending data back to deepstream, with `clientData` available in the `client.login()` callback and `serverData` sent to the permissions handler.

Start the deepstream server and you should see the authentication type confirmed.

![deepstream starting with http authentication](ds-auth-http-start.png)

This simple node server returns an http code of '200' when a certain username is passed, and '404' if it's any other username:

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.post('/auth-user', (req, res) => {
  if (req.body.authData.username === 'chris') {
    res.json({
      id: 'chris',
      clientData: { themeColor: 'pink' },
      serverData: { role: 'admin' }
    })
  } else {
    res.status(403).send('Invalid Credentials')
  }
})

app.listen(3000)
```

In your application code you can now connect to the deepstream server and try to login a user. Try changing the value of username to something aside from 'chris' to see what happens.

`embed: js/login-es5.js`
`embed: js/login-es6.js`

If a success, the deepstream console will show:

![Authentication success](ds-auth-http-success.png)

And if a failure:

![Authentication failure](ds-auth-http-fail.png)
