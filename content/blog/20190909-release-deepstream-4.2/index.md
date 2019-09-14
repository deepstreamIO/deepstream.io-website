---
title: "Release: Deepstream 4.2" 
description: MQTT AND JSON Protocol support!
---

Two new connection endpoints have been added. They are currently experimental and will be properly
announced with associated documentation. 

One endpoint is mqtt! This allows us to support mqtt auth (using username and password), retain using records and QoS 1 using write acks. The only issue is since mqtt only supports one sort
of concept (with flags distinguishing them) we bridge both events and records together. That means if you subscribe to 'temperature/london', you'll get the update from both a client doing `event.emit('temperature/london')` and `record.setData('temperature/london')`.

The second endpoint is `ws-json` which allows users to interact with deepstream by just passing through json serialized text blobs instead of protobuf. This is mainly to help a few people trying to write SDKs without the hassle of a protobuf layer.

Value also injects a `name` variable which allows you to reference the name your currently in. Useful for cross referencing.

### Fix

Subscription registry seemed to have a massive leak when it came to dead sockets! This has now been fixed. The sockets seemed to have gotten the remove event deleted earlier in their lifecycle which prohibited it from doing a proper clean up later. 