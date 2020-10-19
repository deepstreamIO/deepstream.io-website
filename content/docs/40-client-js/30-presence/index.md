---
title: Presence
description: API docs for deepstream's presence feature, allowing clients to know about other connected clients
---

Presence allows clients to know when other clients come online and offline, as well as the ability to query for connected clients.

It's worth mentioning that presence only shows clients that logged in with a username. For example, `client.login()` won't trigger the callback `client.presence.subscribe(callback)`.

## Methods

### client.presence.subscribe( username, callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|username|String|true|A username that should be subscribed to.|
|callback|Function|false|Will be invoked with the username of a client, and a boolean to indicate if it was a login(true) or logout(false) event|

Subscribes to presence events. Callback will receive the username of the newly logged in/out user

```javascript
// Client A
client.presence.subscribe((username, isLoggedIn) => {
  // handle every new user login/logout
})

client.presence.subscribe('Alex', (username, isLoggedIn) => {
  // handle Alex only
})

// Client B
client.login({username: 'Alex'})
```

### client.presence.unsubscribe( username, callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|username|String|true|The username that was subscribed to.|
|callback|Function|true|A previously registered named callback|

Removes a previously registered presence callback. If no callback is provided all presence subscriptions will be removed.

```javascript
function onOnlineStatusChange( username, isOnline ) {
  //...
}
// Client A
client.presence.subscribe( onOnlineStatusChange )
// unsubscribe callback
client.presence.unsubscribe( onOnlineStatusChange )

// unsubscribe all presence callbacks for a previously subscribed username
client.presence.unsubscribe( 'username' )

// unsubscribe all
client.presence.unsubscribe()
```

### client.presence.getAll( usernames, callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|usernames|Array|true|An array of specific usernames that should be queried.|
|callback|Function|false|A function that will be called with an error value and an array or object of usernames that are online|

Queries for currently connected clients

```javascript
// Client B
client.presence.getAll((error, clients) => {
    // error = null, clients = [ 'Alex', 'Ben', 'Charlie' ]
})
```

Query for specific users

```javascript
// Client B
client.presence.getAll(['Alex', 'Pedro',], (error, clients) => {
    // error = null, clients = {Alex: true, Pedro: false}
})
```
