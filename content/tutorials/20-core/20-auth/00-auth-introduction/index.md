---
title: Auth Introduction
description: Deepstream authentication mechanisms
---

Deepstream comes with different authentication mechanisms that can integrate with different providers.

The available authentication strategies are:

- [Auth None](/tutorials/core/auth/none/)
- [file-based authentication](/tutorials/core/auth/file/)
- [storage-based authentication](/tutorials/core/auth/storage/)
- [HTTP authentication](/tutorials/core/auth/http-webhook/)
- [JWT authentication](/tutorials/core/auth/jwt-auth/)


You can set one or multiple authentication types simultaneously and the incoming connection will be validated against each of them until one succeeds or all fail. You just need to make them available on the deepstream server config.

The `reportInvalidParameters` option on each authentication configuration must be set to `false` in order to allow for multiple auth strategies. Otherwise the first authentication provider that fails will return with an unauthorized request response and no more auth providers will be queried.
