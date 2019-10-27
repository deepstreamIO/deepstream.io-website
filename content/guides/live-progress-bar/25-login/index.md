---
title: Logging in to deepstream
description: "Step three: How to login to the server using HTTP auth"
---

Since we already have an express server running let's just use it to add an authentication endpoint.

### Adding a HTTP authentication endpoint

First thing we'll need to do is add a HTTP endpoint that responds to a POST request with the correct structure:

```json
{
  // The user unique id
  "id": "uuid",
  // The data used by the server for permission purposes
  "serverData": {},
  // The data returned to the user on a successful login
  "clientData": {}
}
```

So putting that into express as a post will look like:

```javascript
// A very basic token function
function isValidToken (token) {
  return token !== 'this-is-my-token'
}

app.post('/realtime-login', (req, res) => {
  if (isValidToken(req.body.token) === false) {
    response.status(401)
    return
  }

  response.json({
    id: 'the-only-authenticated-user',
    serverData: { role: 'admin' },
    clientData: {}
  })
})
```

### Configuring deepstream

In order to use HTTP Authentication please enable the following auth module in your server config

```yaml
auth:
  -
    type: http
    options:
      # a post request will be send to this url on every incoming connection
      endpointUrl: http://localhost:9090/realtime-login
      # any of these will be treated as access granted
      permittedStatusCodes: [ 200 ]
      # if the webhook didn't respond after this amount of milliseconds, the connection will be rejected
      requestTimeout: 2000
      # the codes which the auth handler should retry. This is useful for when the API you depend on is 
      # flaky or going through a not so blue/green deployment
      retryStatusCodes: [ 404, 504 ]
      # the maximum amount of retries before returning a false login
      retryAttempts: 3
      # the time in milliseconds between retries
      retryInterval: 5000
```

## Connecting client to deepstream

To ensure it works we need to connect the client to deepstream. To do so you simply just create a deepstream instance.

```javascript
const client = new DeepstreamClient('localhost:6020/deepstream')
```

You can then look at and monitor the deepstream connection status in order to see if your connected, useful to react to when the connection is ever lost.

```javascript
// Getting the connection state
client.getConnectionState() // This will return AWAITING_AUTHENTICATION

client.on('connectionStateChanged', (newState) => {
    // newState will be OPEN when the connection has been correctly authenticated
})
```

## Logging client into deepstream

Great! You now have a connection to the server. The last thing to do is login. In order to do you so you can either use Promises, async/await or a login callback. For code readability I will be using async/await for all examples in this guide.

```javascript
async () => {
    const clientData = await client.login({ token: 'this-is-my-token' })
    client.getConnectionState() // This will return OPEN
}
```

## Enabling open-auth for anonymous users

In this application we actually don't actually care about the front-end permissions, since anyone can request a progress event. This is where multiple authentication providers can shine. By just adding an open authentication as the last (in this case second) authentication layer all users are accepted, but we'll be able differently permission anonymous users to greatly limit their impact


```yaml
auth:
  -
    type: http
    options: ...
  -
    type: open
```

And to login in the browser just add:

```javascript
const client = deepstream("localhost:6020/deepstream")
// Since it's open we don't need pass anything in
client.login()
```