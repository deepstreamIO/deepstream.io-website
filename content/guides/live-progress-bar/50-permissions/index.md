---
title: Permissions
description: "Step three: Restricting who can emit events"
---

Since the application logic is quite tiny, all we need to do here is limit only the backend servers to emit events.

```yaml
event:
  '*':
    subscribe: "true"
    emit: "server.data.role === 'admin'"
```



