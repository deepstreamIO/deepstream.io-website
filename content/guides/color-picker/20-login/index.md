---
title: Logging in
description: Logging into the deepstream from a JS client
---

The next step is to create a deepstream client, login and initialize the application.

## Setting up Authentication on the backend

In this guide we be using Storage Authentication, feel free to refer the [Authentication](/tutorials/) page to try out other types of authentication or look at some of the alternative different guides.

In order to use Storage Authentication please enable the following auth module in your server config

```yaml
auth:
  type: storage
  options:
    # the table users are stored in storage
    table: 'Users'
    # automatically create users if they don't exist in the database
    createUser: true
    # the name of a HMAC digest algorithm
    hash: 'md5'
    # the number of times the algorithm should be applied
    iterations: 100
    # the length of the resulting key
    keyLength: 32
```

This will tell deepstream to authenticate your users against the usernames and passwords stored in the database under a table called Users. We also set `createUser` to true, which means any user logging in with a username that doesn't already exist will be created in the database, useful for merging a signup/login form into one (mostly a development feature).

## Connecting client to deepstream

First things first, we need to connect this client to deepstream. To do so you simply just create a deepstream instance.


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
    const clientData = await client.login({
        username: 'username'
        password: 'password'
    })

    client.getConnectionState() // This will return OPEN
}
```

Here we are logging in using the attributed required by [storage authentication](/tutorials/core/auth/storage/), which is the username and password. This will inform deepstream to lookup a user with the provided username, and if it exists to check the password is valid. If the user doesn't exist since we have `createUser` enabled, it will hash the password and create a new user for us.

Within the database, the user structure will be as follows:

```json
{
    "id": "uuid",
    "username": "string: a unique username",
    "password": "string: hashed password",
    "clientData": "JSON object: to be returned to client after successful login",
    "serverData": "JSON object: to be used on server for permissions"
}
```

And will be saved in a table/collection called `User` with the uuid specified. This uuid approach is important since usernames can change with time in some systems, but a uuid will always remain.