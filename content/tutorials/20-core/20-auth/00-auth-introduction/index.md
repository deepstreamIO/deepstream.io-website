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


You can set one or multiple authentication types simultaneously and the incoming connection will be validated against each of them until one succeeds or all fail. You just need to make them available on the deepstream server config. Authentication strategies will be queried in the same order they are declared on the configuration file.  
