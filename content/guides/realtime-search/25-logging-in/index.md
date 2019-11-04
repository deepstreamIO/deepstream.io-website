---
title: Logging in
description: Logging into deepstream
---

To keep this guide as lightweight as possible, we will be logging in using [anonymous authentication](/tutorials/core/auth/none/).

So in order to login to deepstream all we need to add is the following after the deepstream constructor:

```javascript
const client = new DeepstreamClient('localhost:6020')
await client.login()
```

That was quick wasn't it! You can checkout the other guides and tutorials on authentication.