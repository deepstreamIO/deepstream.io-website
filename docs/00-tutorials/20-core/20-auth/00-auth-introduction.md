---
title: Auth Introduction
---

Deepstream comes with different authentication mechanisms that can integrate with different providers.

The available authentication strategies are:

- [Auth None](10-none.md)
- [file-based authentication](20-file.mdx)
- [storage-based authentication](21-storage.mdx)
- [HTTP authentication](30-http-webhook.mdx)
- [JWT authentication](40-jwt-auth.md)


You can set one or multiple authentication types simultaneously and the incoming connection will be validated against each of them until one succeeds or all fail. You just need to make them available on the deepstream server config. Authentication strategies will be queried in the same order they are declared on the configuration file.
