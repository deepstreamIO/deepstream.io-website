---
title: Interface PresenceEventListener
description: A listener that's notified whenever an authenticated client logs into or out of deepstream
category: interface
navLabel: PresenceEventListener
body_class: dark
---

This listener is notified whenever an authenticated client (ie. one that logged in with credentials) logs in or out.

## Methods

### void onClientLogin(String name)

```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The users name or ID
{{/table}}
```

### void onClientLogout(String name)

```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The users name or ID
{{/table}}
```
