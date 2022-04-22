---
title: Query connected clients
tags: [Javascript, Presence]
---

deepstream's presence feature allows the users in your application to track the online or offline status of other users.

It is possible to ask presence to either send you a list of all the people who are currently logged in or to send you a notification whenever the login status of a client who is already authenticated changes. Presence comes with the following three methods:

`getAll()`, `subscribe()` and `unsubscribe()`

## getAll()

Using the `getAll()` method we can retrieve the status of connected clients at any particular instance of time. This can be done in two ways!

If you would like to see all the users who are online in your application, you could just do the following:

```javascript
client.presence.getAll((error, usernames) => {
  // error = null, usernames = ['Homer', 'Marge', 'Lisa']
})
```

The above function would return all the users who are currently logged in into your application.

Optionally, you can retrieve the online/offline status of only selected users and not everyone else by doing the following:

```javascript
client.presence.getAll(['Homer', 'Marge', 'Lisa'], (error, result) => {
  /*
    error = null,
    clients = {
      'Homer': true,
      'Marge': true,
      'Lisa': false
    }
  */
})
```

## subscribe()
You can use the `subscribe()` method to enable continous observation of client logins and logouts. In simple terms, when you subscribe using presence, you receive a notification whenever an existing client logs out or a new client logs in. This also has two scenarios:

If you wish to observe ALL your clients' login/logout activities, you could do the following:

```javascript
function presenceCallback(username, login) {
  if (login === true) {
    // handle login
  } else {
    // handle logout
  }
}
// Client A
client.presence.subscribe(presenceCallback)
```

In the above subscribe function, the server returns the username along with the login status everytime this changes for any connected user.

Alternatively, if you wish to observe the login/logout activity of only a particular client, you can do so by sending the username in the subscribe function as shown below:

```javascript
// Client A
client.presence.subscribe('Marge', presenceCallback)
```

It is important to understand that if a user logs in on multiple devices, only the first login instance and the last logout instance will be counted as a legitimate state change by presence. Hence, if you login into multiple devices and logout of one of them, your status remains as logged in until you log out of the last device/browser.

## unsubscribe()

As the term itself suggests, if you are already subscribed to notifications but no longer wish to continue receiving notifications, simply use the  `unsubscribe()` method.

Here's an example:

```javascript
// Client A
client.presence.unsubscribe(presenceCallback)
```

Presence is important because it is the only way to know the connection status of a user and further query on it for any use cases.
