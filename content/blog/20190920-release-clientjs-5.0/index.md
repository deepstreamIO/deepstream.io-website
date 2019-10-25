---
title: "Release: Javascript/Node 5.0" 
description: Better Typescript and MIT
redirectFrom: [/releases/clientjs/v5-0-0/]
---

This version bump is mainly to respect the major version of the deepstream server, and is (almost) fully compatible with V4.

The one breaking change we figured we should sneak in is the following:

```javascript
import { DeepstreamClient } from '@deepstream/client'
const client = new DeepstreamClient('localhost:6020/deepstream')
```

as opposed to how it was done before: 

```javascript
import * as deepstream from '@deepstream/client'
const client = deepstream('localhost:6020/deepstream')
```

This provides much better typescript support.