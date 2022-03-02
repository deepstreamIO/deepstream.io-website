---
title: "WebRTC 02: Many-To-Many connectivity"
description: Learn how to setup WebRTC connections between multiple clients and share messages within rooms
tags: [WebRTC, Rooms, many-to-many, full-mesh]
---
As we've seen in the previous [data-channels tutorial](../webrtc-datachannels) establishing a WebRTC connection between two peers is simple enough when using a high level library. But often you'll want to chat with multiple users in the same room, join a video conference or share a file with a number of people.

The only trouble is: WebRTC does not have any pre-build concepts to handle many-to-many communication. This leaves you with the following options:

### Creating a Full Mesh
For smaller groups you can establish a connection from every peer to every other one. This is known as a "full mesh network topology".

The benefits of full mesh networks are their decentralised state and their relative simplicity. The huge downside however is their lack of scalability - with every additional client the total number of connections grows by n - 1. Likewise, every message has to be send to every client individually causing substantial bandwith overheads.

### Other Network topologies
Full-Mesh networks are not the only way to create decentralized peer-to-peer topologies. Other approaches, e.g. [Small World Networks](https://en.wikipedia.org/wiki/Small-world_network) or [Hierarchical/Tree Networks](http://www.ciscopress.com/articles/article.asp?p=2202410&seqNum=4) can provide a better compromise between scalability and latency by turnign some nodes into relays that forward data to others.

### Using a relaying server
For a lot of usecases however it will be best to avoid peer-to-peer communication altogether and instead connect to a server-side process. For numerous large scale WebRTC users such as Google Hangouts or Twilio, the peer is always a server that gathers, aggregates, processes and forwards the data. You can learn more about this in the [final part of this tutorial](/tutorials/webrtc//webrtc-in-production/) where we talk about selective forwarding units, bridges, multicasting and other bits and bobs that are required to make WebRTC work in the real world.

## Getting down to code
For this tutorial, we'll look into creating a Full Mesh between connected clients. To do this we'll perform the following steps:

- We generate a random user-id for every client
- We store this user-id centrally in a [deepstreamHub List](https://deepstreamhub.com/tutorials/guides/lists/)
- Whenever a client joins it, establish a connection to every user in that list
- To broadcast a message, we iterate trough all connections and send it to each
- Whenever a connection is cut, the other clients remove it from the room

Here's how this works: (as always you can find the full code for [this example on Github](https://github.com/deepstreamIO/dsh-demo-webrtc-examples/tree/master/02-full-mesh) and a live demo at the end of this article)

We start by connecting to deepstreamHub and creating a random user id:

```javascript
const ds = deepstream( '<your-api-key>' ).login();
const localUserName = ds.getUid();
```

To keep track of the userIds in our room we create a [deepstreamHub List](https://deepstreamhub.com/tutorials/guides/lists/) - an observable array of strings whose state will be shared with all connected clients. As our own user is also a member of this chatroom, we'll add our username to the list straight away.

```javascript
const users = ds.record.getList( 'users' );
users.addEntry( localUserName );
```

Now whenever a user is added to the list, we want to establish a peer to peer connection to them. To do this we subscribe to changes to the list.

```javascript
// Create an empty map with username to connection
const connections = {};

// Notify whenever the list of users changes
users.subscribe( userNames => {
    userNames.forEach( userName => {
        // If we already have a connection for this username return
        if( connections[ userName ] ) return;
        // That's us - no need to connect to ourselves
        if( userName === localUserName ) return;
        // Create a new connection
        connections[ userName ] = new Connection( userName );
    })

    // Here we do the reverse - iterate through our existing connections
    // and check if they are all still in the room
    for( var userName in connections ) {
        if( userNames.indexOf( userName ) === -1 ) {
            //this one's gone - let's remove it
            connections[ userName ].destroy();
        }
    }
});
```

The connections themselves are similar to the ones used in the [data-channels tutorial](/tutorials/webrtc//webrtc-datachannels/), wrapped into a class. There are only two differences:

### Signals are handled centrally
Each peer has to send SDP signals back and forth to establish the connection - but as we are managing multiple connections now we'll also receive multiple signals. To handle these we register a central listener for messages. Incoming messages are routed to the relevant recipient:

```javascript
ds.event.subscribe( `rtc-signal/${localUserName}`, msg => {
    if( connections[ msg.user ] ) {
        connections[ msg.user ].processSignal( msg.signal );
    }
});
```

### Removing connections on close
Whenever a connection is closed we need to remove the associated user from our list of users in this room. To do this we use the list's `removeEntry()` method.

```javascript
// subscribe to the p2pConnection's close event
this._p2pConnection.on( 'close', this._onClose.bind( this ) );

// and remove the connection upon close
_onClose() {
    delete connections[ this._remoteUserName ];
    users.removeEntry( this._remoteUserName );
}
```

To put everything into perspective please have a look at the [full code](https://github.com/deepstreamIO/dsh-demo-webrtc-examples/blob/master/02-full-mesh/full-mesh.js) or try the editable live example below.

Now that we've got connections covered it is time to look into sending audio and video streams through them in [the next tutorial](../webrtc-audio-video)
