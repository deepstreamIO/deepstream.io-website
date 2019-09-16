---
title: "Release: Javascript/Node 4.1" 
description: Default Timer Implementation
redirectFrom: [/releases/server/v4-1-0/]
---

Including a default implementation of timeouts using the native setTimeout API. The interval based one was created in order to mitigate the insane amount
of ack registries we used to have get created, and also because setting timeouts
isn't cheap (you can verify this by creating a couple thousand records and noticing the cost within the default noop storage registry). However as correctly stated by @Krishna [here](https://github.com/deepstreamIO/deepstream.io-client-js/issues/500) the interval implementation is naive in terms of mobile (looping every 20milliseconds for idle connections is overkill) and the benefits now is no longer as apparent as during the RC release (since bulk messaging now only makes one timeout for N amount amount of subscriptions).

You can toggle them with the following:

```
# When true uses setTimeout
nativeTimerRegistry: true,
# When nativeTimerRegistry is false uses an interval with this timer resolution
intervalTimerResolution: 50,
```

Either ways both implementations are expensive in terms of garbage collection since it binds to the context and data as part of the API. This can probably be avoided by providing a null context going forward.
