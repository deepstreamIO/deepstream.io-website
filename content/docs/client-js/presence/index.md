---
title: Presence
description: API docs for deepstream's presence feature, allowing clients to know about other connected clients
---

Presence allows clients to know when other clients come online and offline, as well as the ability to query for connected clients.

It's worth mentioning that presence only shows clients that logged in with a username. For example, `client.login()` won't trigger the callback `client.subscribe(callback)`.

## Methods

### client.subscribe( callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|false|Will be invoked with the username of a client, and a boolean to indicate if it was a login(true) or logout(false) event|

Subscribes to presence events. Callback will receive the username of the newly added client

```javascript
// Client A
client.presence.subscribe((username, isLoggedIn) => {
  // handle new user
})

// Client B
client.login({username: 'Alex'})
```

### client.unsubscribe( callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|false|A previously registered callback|

Removes a previously registered presence callback

```javascript
function onOnlineStatusChange( username, isOnline ) {
  //...
}
// Client A
client.presence.subscribe( onOnlineStatusChange )
client.presence.unsubscribe( onOnlineStatusChange )
```

### client.getAll( callback )

|Argument|Type|Optional|Description|
|---|---|---|---|
|callback|Function|false|A function that will be called with an array of usernames that are online|

Queries for currently connected clients

```javascript
// Client B
client.presence.getAll((clients) => {
    // [ 'Alex', 'Ben', 'Charlie' ]
})
```

## Video Demo 
If you would like to learn more find out our video tutorial with Alex Harley, explaining more in detail about presence in deepstream.


</br>
<iframe width="780" height="439" src="https://www.youtube.com/embed/EdYzxVKIjJs" frameborder="0" allowfullscreen></iframe>