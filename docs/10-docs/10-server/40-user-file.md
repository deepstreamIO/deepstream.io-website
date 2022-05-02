---
title: User File
description: The API on how you can configure and use file-based authentication
---

The API on how you can configure and use [file-based authentication](../../00-tutorials/20-core/20-auth/20-file.mdx). The file is structured as a map of usernames and their associated passwords and optional auth data.

The userfile can be written in YAML or JSON.

```yaml
# Username as key
johndoe:
  # Password as hash if auth.options.has is configured or in cleartext
  password: uY2zMQZXcFuWKeX/6eY43w==9wSp046KHAQfbvKcKgvwNA==
  # Optional auth data that will be passed to permissioning as user.data
  clientData:
    favoriteDessert: brownies
  serverData:
    role: admin

samjones:
  password: 7KZrUQcnFUDNOQtqtKqhCA==ElDieSHdI2vtiws41JF/HQ==
  clientData:
    favoriteDessert: shortbread
  serverData:
    role: user
```

or in JSON

```json
{
    "johndoe": {
        "password": "uY2zMQZXcFuWKeX/6eY43w==9wSp046KHAQfbvKcKgvwNA==",
        "clientData": { "favoriteColor": "yellow" },
        "serverData": { "role": "admin" }
    },
    "samjones": {
        "password": "7KZrUQcnFUDNOQtqtKqhCA==ElDieSHdI2vtiws41JF/HQ==",
        "clientData": { "favoriteColor": "violet" },
        "serverData": { "role": "user" }
    }
}
```


### password
Can either be the user's plaintext password or a hash of the password

If you've configured file-based authentication as follows, use plaintext passwords:

```yaml
   type: file
   options:
     users: fileLoad(users.yml)
     hash: false
```

If you've configured a hashing algorithm, use hashes as password:

```yaml
   type: file
   options:
     users: fileLoad(users.yml)
     hash: 'md5'
     iterations: 50
     keyLength: 16

```

:::info
You can create hashes from passwords with the currently specified settings using deepstream's command line interface

```bash
deepstream hash <password>
```
:::

### data
Optional authentication data, e.g. `role: admin` or `canCreatePosts: true`. This data will be available in your permission rules as `user.data`. Data stored within clientData will also be forwarded to the client as part of the login process.

```json
{
    "samjones": {
        "password": "7KZrUQcnFUDNOQtqtKqhCA==ElDieSHdI2vtiws41JF/HQ==",
        "clientData": { "user-alias": "sammy" },
        "serverData": { "role": "user" }
        }
    }
}
```
