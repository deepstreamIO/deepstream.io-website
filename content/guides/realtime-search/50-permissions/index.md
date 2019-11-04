---
title: Permissions
description: "Step three: Restricting who can emit events"
---

When using realtime-search we have two different aspects to permission. As a general rule of thumb, lock down your permissions by default and only open up topics instead of vice versa.

- the rpc

This is the most important part, which gives the you the ability to stop the RPC from ever
making it to to the realtime-provider. You also want to make sure only the realtime_search
can provide the actual rpc hook so another client doesn't register it!

- the record

You want to make sure only the backend can update the list and meta objects, as again a front-end
client should not be able to do so. The same with listening patterns

`embed:server/realtime-search/example/conf/permissions.yml`


