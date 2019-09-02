---
title: Interface ListenListener
description: An interface that notifies whenever a pattern match has been found or removed
category: interface
navLabel: ListenListener
body_class: dark
---

An interface that notifies whenever a pattern match has been found or removed when added via <a href="./EventHandler#listen(listener)"><code>event.listen(istener)</code></a> or <a href="./RecordHandler#listen(listener)"><code>record.listen(istener)</code></a>

## Methods

### boolean onSubscriptionForPatternAdded(String subscription)

```
{{#table mode="java-api"}}
-
  arg: subscription
  typ: String
  des: The name of the subscription that can be provided
{{/table}}
```

Called whenever a subscription has been found a on pattern you previously added. This method must return a true if it is willing to provide the subscription, and false otherwise. This also has to be done in a timely fashion since the server will assume the provider is unresponsive if it takes too long.

### void onSubscriptionForPatternRemoved(String subscription)

```
{{#table mode="java-api"}}
-
  arg: subscription
  typ: String
  des: The name of the subscription to stop providing
{{/table}}
```

If a provider has accepted a request, they will then be notified when the subscription is no longer needed so that they can stop providing
