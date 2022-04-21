---
title: Auth Introduction
---

Deepstream comes with different authentication mechanisms that can integrate with different providers.

The available authentication strategies are:

- [Auth None](/docs/docs/tutorials/core/auth/none/)
- [file-based authentication](/docs/docs/tutorials/core/auth/file/)
- [storage-based authentication](/docs/docs/tutorials/core/auth/storage/)
- [HTTP authentication](/docs/docs/tutorials/core/auth/http-webhook/)
- [JWT authentication](/docs/docs/tutorials/core/auth/jwt-auth/)


You can set one or multiple authentication types simultaneously and the incoming connection will be validated against each of them until one succeeds or all fail. You just need to make them available on the deepstream server config. Authentication strategies will be queried in the same order they are declared on the configuration file.
