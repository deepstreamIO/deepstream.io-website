---
title: "WebRTC: Fundamentals & Concepts"
description: Learn what WebRTC is, how it works, what you need to get started and where this guide fits in
tags: [WebRTC]
---

Talking directly from browser to browser? Sign me up! WebRTC just makes so much sense and it lets you do many awesome new things that simply weren't possible before. How about in-browser voice and video-chat, file-transfers, screen-sharing or server-less chats? The possibilities are endless and have spawned entirely new use cases such as p2p-cdns [greta.io](https://greta.io/) or [peer5](https://www.peer5.com/) and companies like [TokBox](https://tokbox.com/) or [agora.io](https://www.agora.io/en/).

![WebRTC Logo](webrtc-logo.png)

But there are problems: First and foremost - WebRTC is hard! As far as browser APIs go its very low level and leaves many aspects of connection establishment and upkeep to the developer.
And once you've got your first videochat working you'll realise something else: it's incredibly hard! Using WebRTC for realworld apps such as [Google Hangouts](https://hangouts.google.com/) requires a host of server side infrastructure that processes, aggregates and forwards data, manages state and connectivity and provides smoothing for the hundreds of edge cases that continue to exists around peer-to-peer video and audio streaming.

This shouldn't discourage you though. Depending on your requirements WebRTC might not only be the fastest solution, but simply the only choice. And it might help you save lots of money by keeping data-heavy traffic of your servers.

#### Where does this guide fit in?
This guide will take you through the basics of setting up WebRTC data, voice and video channels between two peers as well as whole rooms of users, sending files, manipulating video or sharing your screen. It's neither very low level (we'll be using WebRTC client libraries for connectivity rather than the browser API) or super high level (we won't be using one of the many WebRTC PaaS APIs such as [Twilio's](https://www.twilio.com/webrtc)).

The goal is that once you've read through it you've gained a solid, hands-on understanding of what it takes to build WebRTC apps and enough additional knowledge to know where to go next.

## What is WebRTC?
WebRTC (Web Real-Time Communication) is a set of protocols, standards, APIs and concepts required to establish point-to-point transmission of text or binary data between peers. These peers are usually two browsers, but WebRTC can also be used to communicate between client and server or between any other device capable of implementing the WebRTC standard.

## What do we need to get started?
Two things: a reasonably recent browser (WebRTC is supported in current versions of Chrome, Firefox, Edge and Opera but not in Safari or many mobile browsers) and **drumroll** - a server.

#### Hold on - why do we need a server?
Isn't WebRTC all about peer-to-peer communication? Well, yes - it is. But these peers need to  find each other. The problem is that your browser only has an ant's view of its own location. Imagine asking your friend for her address and she replies with "I'm in the red house". Great - but now you'll need to figure out which street this house is in, which city the street is in and so on - and once you've got all this information together and made it to her house you'll still need to try a couple of doors and windows to find one that lets you in.

This process is called "Interactive Connectivity Establishment" or ICE for short and it involves an external server that transmits SDP signals between the peers as well as possibly an additional STUN or TURN server to overcome a NATS. A what to what? Welcome to what has been lovingly labelled the "ocean of acronyms" - to learn more I can highly recommend [WebRTC and the ocean of acronyms](https://hacks.mozilla.org/2013/07/webrtc-and-the-ocean-of-acronyms/) by Louis Stowasser and of course to always keep your handy [WebRTC Glossary](https://webrtcglossary.com/) ready.

For this guide we'll be using [deepstreamHub](https://deepstreamhub.com/) as a signalling platform as well as a way to keep state (e.g. lists of users in a room) and some of the [numerous public STUN and TURN servers](https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b).

Alright, time to get started with our first usecase: [Establishing a WebRTC connection between two browsers](../webrtc-datachannels).

