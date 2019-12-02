---
title: "WebRTC 01: Data Channels"
description: Set up a WebRTC connection between two clients and send simple messages
tags: [WebRTC, DataChannels, Text Data, Binary Data]
---

Let's start with a simple example: Establishing a connection between two browser windows and sending text messages back and forth. For this we'll use [WebRTC data-channels](https://developer.mozilla.org/en/docs/Web/API/RTCDataChannel) - the basic connection type that lets you send text and binary data directly between two peers.

## Choosing a WebRTC library
By browser standards the WebRTC API is extremly complicated and low level. When you want to establish a Websocket connection all you need to do is call `new Websocket( 'ws://...' )`... but with WebRTC the entire connection establishment, generating offers and answers, sending and receiving ICE candidates and other protocol steps are up to you. If you'd like to give it a try I can highly recommend [Mozilla's DataChannel tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample), but for this guide we'll keep things simpler by using a library.

There are many WebRTC libraries available that provide convenience methods or high level abstractions. WebRTC has been an emerging standard and is still somehwhat in flux, so its crucial to make sure that whatever library you choose is up to date and well maintained.

For our examples we'll be using [Simple Peer](https://github.com/feross/simple-peer): a basic, very clean low level wrapper around P2P connections.

## Who's calling who?
Time to get our browser windows to call each other. But first we have to work out who's awaiting the call and who's making it. To keep things simple  we'll add a hash `#initiator` to one window's URL. So when establishing the connection we specify

```javascript
const p2pConnection = new SimplePeer({
    initiator: document.location.hash === '#initiator'
});
```

In the [full mesh example](/tutorials/webrtc/webrtc-full-mesh/) ([GitHub-friendly link](/tutorials/98-webrtc/20-webrtc-full-mesh/))  well compare usernames `localUserName > remoteUserName` to achieve the same.

## Signaling
As the connection is being established, both peers need to send information about themselves and how to reach them to each other - the previously mentioned Interactive Connectivity Establishment Process (or ICE for short).

Simple peer makes this easy. Whenever our local peer wants to send a signal to the remote, it emits a `'signal'` event. Whenever we receive a signal we process it using our connection's `.signal()` method. The signals themselves are transmitted using [events, deepstreamHub's publish/subscribe mechanism](https://deepstreamhub.com/tutorials/guides/events/).

We establish a connection by calling

```javascript
const ds = deepstream( '<your dsh url>' ).login();
```

To make sure we're not receiving our own events we'll create a random username on both sides

```javascript
const userName = 'user/' + ds.getUid();
```

and use it to filter out our own signals

```javascript
p2pConnection.on( 'signal', signal => {
    ds.event.emit( 'rtc-signal', {
        sender: userName,
        signal: signal
    });
});

ds.event.subscribe( 'rtc-signal', msg => {
    if( msg.sender !== userName ) {
        p2pConnection.signal( msg.signal );
    }
});
```

Once established, our connection emits a `'connect'` event.

```javascript
p2pConnection.on( 'connect', () => {});
```

from here on we can simply send messages using

```javascript
p2pConnection.send( 'Hey ho' );
```

and receive them via

```javascript
p2pConnection.on( 'data', data => {
    console.log( data.toString() );
});
```

Bottom line: Establishing a connection between two peers is easy enough - but once we move on to [many-to-many connectivity and rooms](../webrtc-full-mesh), things get a little more tricky.
