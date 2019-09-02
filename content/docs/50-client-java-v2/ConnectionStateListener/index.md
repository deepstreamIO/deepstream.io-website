---
title: Interface ConnectionStateListener
description: A listener that's notified whenever the client's connections tate changes
category: interface
navLabel: ConnectionStateListener
body_class: dark
---

A listener that will be notified whenever the ConnectionState changes. Can be added via
<a href="./DeepstreamClient/#addConnectionChangeListener(listener)"><code>DeepstreamClient.addConnectionChangeListener(listener)</code></a> and removed via <a href="./DeepstreamClient/#removeConnectionChangeListener(listener)"><code>DeepstreamClient.removeConnectionChangeListener(listener)</code></a>.

Learn more about [connections states and connectivity issues](/docs/general/connectivity/)

## Methods

### void connectionStateChanged(ConnectionState connectionState)


```
{{#table mode="java-api"}}
-
  arg: state
  typ: ConnectionState
  des: The current connection state
{{/table}}
```

Called with the new updated connection state. Useful for enabling applications to respond to different scenarios, like [ConnectionState.ERROR](/docs/general/connectivity/) if an error occurs, or [ConnectionState.RECONNECTING](/docs/general/connectivity/) if the connection drops.