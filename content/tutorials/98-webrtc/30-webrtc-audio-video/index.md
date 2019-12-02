---
title: "WebRTC 03:Audio & Video"
description: Learn how to establish audio and video streams using deepstream
tags: [WebRTC, Video, Audio]
---

Once you know how to [establish a WebRTC connection between two peers](../webrtc-datachannels) ([Github-friendly link](../10-webrtc-datachannels)), adding audio and video streams to this connection is surprisingly easy.

First of all we request access to the user's microphone and camera using the browser's `navigator.getUserMedia` method. Once we have access to a stream we store a reference to it, render it on a video element using `URL.createObjectURL( stream )` and establish our P2PConnection.

```javascript
navigator.getUserMedia(
    { video: true, audio: true },
    stream => {
        localStream = stream;
        $( '.local video' ).attr( 'src', URL.createObjectURL( stream ) );
        init();
    },
    error => {
        alert( 'error while accessing usermedia ' + error.toString() );
    }
);
```

When establishing the connection we'll add the stream as a parameter:

```javascript
const p2pConnection = new SimplePeer({
    initiator: document.location.hash === '#initiator',
    stream: localStream
});
```

On the other client this will trigger a `'stream'` event as soon as the stream becomes available. Upon receiving it we'll again render it to an HTML5 video tag.

```javascript
p2pConnection.on( 'stream', remoteStream => {
    $( '.remote video' ).attr( 'src', URL.createObjectURL( remoteStream ) );
});
```

And that's already all it takes to establish a simple audio & video chat between to peers Please find the [full code here](https://github.com/deepstreamIO/dsh-demo-webrtc-examples/blob/master/02-full-mesh/full-mesh.js) or try the editable live example below by <a href="/tutorials/protocols/webrtc-audio-video/" target="_blank">opening this page in a few more windows</a> and having a chat with yourself.

### Is that really all there is to it?
If you are a regular user of video conferencing software you know one thing only too well: It doesn't work properly. Reliable video-chat is still an extremely hard problem to solve and even giants like Google or Skype struggle to provide reliable and high-quality streams between users.

WebRTC is no difference. If you've tried the example above it probably worked well - but only because there's a limited number of users chatting on a local network. For larger usecases you'll most likely want to avoud peer-to-peer connectivity and instead relay your video-stream to a server.

This server can be a so called Selective Forwarding Unit (SFU), e.g. [Jitsi's Video Bridge](https://jitsi.org/Projects/JitsiVideobridge) or a general purpose WebRTC Gateway such as [Janus](https://janus.conf.meetecho.com/).

Alternatively you can also use one of the many cloud service providers in this space, e.g. [TokBox](https://tokbox.com/) or [Skylink](https://skylink.io/).

## Manipulating video
So far we've only worked with the raw video stream from our webcam. But in times of Snapchat dog-nose overlays and Instagram retro-filters this might not be enough. Move on to the [next tutorial](../webrtc-video-manipulation) to learn how to edit the stream before sending it to a peer.
