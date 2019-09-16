---
title: "Release: Deepstream 3.0" 
description: a foundation for a multi-protocol-server
---

I’m terrible with secrets. I’ve always been. Back when I was still working in corporate land, I gave our receptionist a run for her money when it came to gossiping — and trust me, this is saying a lot.

![deepstream 3.0](3.0-deepstream.png)

Today, with deepstream 3.0 on the horizon I’m not much better:

Over the last month we’ve been working hard to turn deepstreamHub into a global realtime platform — one that goes beyond the current generation of PubSub services or realtime DBs and makes cloud-based deepstream accessible at large scale.

But deepstreamHub isn’t just hosted deepstream. It comes with its own set of features. Amongst the most popular ones: our HTTP API.

The API makes it possible for any programming language to create, read, write and delete records, send events or make RPCs. This opened up a whole new range of usecases: sending events from AWS Lambda functions, bulk importing thousands of records at once, making AJAX calls without establishing a deepstream connection — to name just a few.

With deepstream 3.0 this API will come back to open source. But we didn’t just take some code from the hub and put it into the open source server — we want to go further:

deepstream 3.0 will come with a re-architected abstract connection endpoint, making it possible to add any number of communication mechanisms and protocols to exchange data and interact with deepstream’s records, events and RPCs:

GraphQL, MQTT, STOMP, Binary transports…just a few of the things on the horizon…
