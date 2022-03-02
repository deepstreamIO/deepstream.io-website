---
title: Logging in
description: Logging into deepstream
---

To keep this guide as lightweight as possible, we will be logging in using [anonymous authentication](/tutorials/core/auth/none/) for the front-end users, and [file auth](/tutorials/core/auth/file/) for the backend.

By just settings a DEEPSTREAM_PASSWORD environment variable on the realtime_search provider it will automatically try and login using the `{ username: 'realtime_search', password: process.env.DEEPSTREAM_PASSWORD }`. The least hassle way of getting deepstream to acknowledge the user and provide it some meta data for permissions in the future is to add file auth as one of our authentication types, followed by open auth for all
anonymous users

```yaml
# Authentication
auth:
  - type: file
    options:
      # Path to the user file. Can be json, js or yml
      users: fileLoad(users.yml)

  - type: none
```

Configuring the details on the server is also pretty easy, we just need a `users.yml` file with username, password and isRealtimeSearch meta data. The environment variable automatically gets substituted one file load.

`embed:server/realtime-search/example/conf/users.yml`

So in order to login to deepstream all we need to add is the following after the deepstream constructor:

```javascript
const client = new DeepstreamClient('localhost:6020')
await client.login()
```

That was quick wasn't it! You can checkout the other guides and tutorials on authentication if you want more challenging.