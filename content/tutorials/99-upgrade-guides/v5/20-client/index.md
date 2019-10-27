---
title: Upgrading the js client
description: Upgrading the deepstream js/node client to V5
---

The one breaking change in the V5 client library is the following:

```javascript
import { DeepstreamClient } from '@deepstream/client'
const client = new DeepstreamClient('localhost:6020/deepstream')
```

as opposed to how it was done before: 

```javascript
import * as deepstream from '@deepstream/client'
const client = deepstream('localhost:6020/deepstream')
```

This provides much better typescript support and stops us from trying to do high level wizardry
when creating the bundle