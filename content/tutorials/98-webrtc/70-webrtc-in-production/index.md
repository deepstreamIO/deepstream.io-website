---
title: "WebRTC in production"
description: Learn about the various approaches to video and audio streaming, connection re-establishment, file chunking etc. that are necessary for production ready WebRTC apps
tags: [WebRTC, production, SFU, Chunking]
---

Time for some bad news. The examples from the previous tutorials probably worked well on your machine. They most likely still worked well when you shared them with a few colleagues within your company. But for scalable, world wide WebRTC usage there are quite a few more obstacles to overcome

## Browser Limitations
WebRTC is [supported by latest versions of Chrome, Firefox and IE Edge](https://caniuse.com/#search=webrtc), but not in Safari or a number of mobile browsers. With most browser-standards that would simply mean falling back to other mechanisms, but with WebRTC this is hardly possible. Older alternatives such as [Flash's RTMP](https://de.wikipedia.org/wiki/Real_Time_Messaging_Protocol) are unsupported by the exact same browsers that don't provide WebRTC either. As a result a number of video-conferencing vendors use WebRTC as default, but continue to offer downloadable clients for cases where its unavailable.

## Connectivity
One of the main obstacles when it comes to establishing WebRTC connections is a technique called Network Address Translation or NAT for short. NAT is used by routers, internet service providers or larger companies to bundle multiple endpoints behind a single public IP and route traffic to them. This makes it hard for two peers to connect directly to each other. To circumvent that we can use an approach called "Traversal Using Relays around NAT" or TURN for short. Fortunately there's a number of [publicly accessible STUN and TURN servers](https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b). To use a TURN server just specify its URL in the options for the `RTCPeerConnection` constructor, e.g. ` { iceServers: [ { url: 'stun:stun.l.google.com:19302' } ] }`

Once your connection is established it will still drop occasionally. That might be due to dodgy network conditions, too many open background tabs or any number of other reasons. That's not much of a problem as long as you make sure to keep track of each connection's state and reconnect as soon as it drops.

## Video Streaming
If you have ever used a video conferencing service you'll know one thing: reliable video and audio streaming is still an unsolved problem. WebRTC is no different. Building a peer-to-peer video conferencing app sounds tempting: There's no central server that can go down and no high traffic costs. But it is something that's almost never done in production.

The reasons are manifold. Users have widely differing input and output requirements. Different webcams provide different resolutions, framerates and qualities, which need to be displayed on a myriad of screen and window sizes.

Bandwith plays an even more important role. A compressed HD stream requires around 5 Mbit/second. In a full mesh P2P video conference with 10 attendees each node would need to send and receive 50 Mbit/second - unachievable with the upload speeds that most ISP's provide.

This means that for almost all WebRTC video streaming apps the "peer" is in fact a piece of server hardware or software, either an MCU or a SFU.

## MCU or SFU?
A [MCU (Multipoint Control Unit)](https://en.wikipedia.org/wiki/Multipoint_control_unit) is a technology that consumes one or more video-streams, composes them into a single stream and forwards it to many endpoints. It can also provide additional tasks such as video processing, changing resolution on the fly or generating keyframes and deltas for video compression.

A [SFU (Selective Forwarding Unit)](https://webrtcglossary.com/sfu/) offers similar functionality, but forwards the individual streams upon request.

So what's the difference? Imagine your on a conference call with 20 people, all using different webcams and monitors. With a SFU you get 20 pre-processes streams that need handling. A MCU however gives you a single, well orchestratet stream with what you need to actually display on the screen rather than leaving the heavy lifting to the client.

Sound awesome, right? The truth though is that SFUs are increasingly becoming the standard. MCUs need to decode each video, resize and reformat it and compose a new frame on every update - this is very computation heavy and requires extremely expensive hardware - especially of the advent of HD, 4k and even 8k displays.

Clients, even browsers have however become fast enough to handle quite a lot of computation - so forwarding streams directly using an SFU is often completely sufficient.

## File Transfers
File transfers can be equally tricky. WebRTC gives developers a choice of ordered and reliable TCP style, unordered or unreliable UDP style communication. To efficiently transfer files it makes sense to use an unordered, yet reliable model and optimise speed on a byte level. This also makes it possible to receive parts of a file from multiple peers at once, speeding up downloads significantly.

This does however also mean that its up to the implementation to ensure file integrity using checksums. Another hard limitation is the fact that browsers store the incoming file data in memory - which creates a hard limit to the maximum filesize that can be transferred.

## Where to go from here
I hope this guide - despite all its warnings and pitfalls - motivated you to give WebRTC a go for your next application. To learn more about WebRTC production usecases, have a look at [WebRTCHacks](https://webrtchacks.com/).
