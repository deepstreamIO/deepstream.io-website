---
title: Security Overview
description: How encryption, authentication and permissioning work together
---

Security in deepstream is based on three interrelated concepts:

    - encrypted connections
    - user authentication
    - granular permissions

Here's how they work together:

## Encrypted Connections
deepstream supports transport layer security for web-facing connections using HTTPS and WSS. To setup SSL on deepstream, you need to provide the following configuration keys:

```yaml
sslKey: ./my-key.key
sslCert:  ./my-cert.key
sslDHParams:  ./my-dhl-params.key
sslPassphrase:  ./my-ssl-passphrase.key
```

It's highly recommended to always use a seperate process to do SSL termination. Usually via a load balancer (e.g. Nginx or HA Proxy). To learn more about this, head over to the [Nginx Tutorial](/tutorials/integrations/other-nginx/).

## Authentication
Every incoming connection needs to pass an authentication step. This happens when the client calls `login(data, callback)`.
deepstream comes with three built-in authentication mechanisms:

- [none](/tutorials/core/auth/none/) allows every connection. Choose this option for public sites that don't require access controls.
- [file](https://deepstream.io/tutorials/core/auth-file/) reads authentication data from a static file. This is a good choice for public read / private write use cases, e.g. sports result pages that let every user visit, but only a few backend processes update the result.
- [http](https://deepstream.io/tutorials/core/auth/http-webhook/) contacts a configurable HTTP webhook to ask if a user is allowed to connect. This is the most flexible option as it allows you to write a tiny http server in any language that can connect to databases, active directories, oAuth providers or whatever else your heart desires.

Apart from just accepting / denying incoming connections, the authentication step can also provide two extra bits of information:

- `clientData` is returned to the client upon login. This is useful to provide user specific settings upon login, e.g. `{ "view": "author" }` for a blog
-  `serverData` is kept privately on the server and passed to the permission handler whenever a client performs an action. This makes certain security concepts possible, e.g. role based authentication.

```javascript
"system-settings": {
    //publicly readable
    "read": true,
    //writable only by admin
    "write": "user.data.role === 'admin'"
}
```

### Authentication FAQ

- **When exactly does authentication happen?** When a deepstream client is created, it establishes a connection straight away. The connection however remains in a quarantine state until `login()` is called. This makes sure that auth-data is sent over an encrypted connection and helps to get the at times time-consuming connection establishment out of the way while the user is busy typing passwords.
- **Can I read usernames for auth purposes out of a deepstream record?**
There's no built-in support for this at the moment, but it's easy to use the http auth-type and write a server that reads from the same database or cache deepstream connects to.
- **Can a user connect more than once at the same time**
Yes. The same user can connect multiple times from separate browser windows or devices.

## Permissioning
Permissioning is the act of deciding whether a specific action, e.g. writing to a record or subscribing to an event is allowed.
To help with this, deepstream uses an expressive, JSON-based permissioning
language called Valve. There's a lot to say about Valve. Here's a small Valve
File that should give you a first impression, to learn more though head over to
the [permissioning tutorial](/tutorials/core/permission/conf-simple/)

```yaml
record:

  "*":
    create: true
    delete: true
    write: true
    read: true
    listen: true

  public-read-private-write/$userid:
    read: true
    create: "user.id === $userid"
    write: "user.id === $userid"

  only-increment:
    write: "!oldData.value || data.value > oldData.value"
    create: true
    read: true

  only-delete-egon-miller/$firstname/$lastname:
    delete: "$firstname.toLowerCase() === 'egon' && $lastname.toLowerCase() === 'miller'"

  only-allows-purchase-of-products-in-stock/$purchaseId:
    create: true
    write: "_('item/' + data.itemId ).stock > 0"

event:

  "*":
    listen: true
    publish: true
    subscribe: true

  open/"*":
    listen: true
    publish: true
    subscribe: true

  forbidden/"*":
    publish: false
    subscribe: false

  a-to-b/"*":
    publish: "user.id === 'client-a'"
    subscribe: "user.id === 'client-b'"

  news/$topic:
    publish: "$topic === 'tea-cup-pigs'"

  number:
    publish: "typeof data === 'number' && data > 10"

  place/$city:
    publish: "$city.toLowerCase() === data.address.city.toLowerCase()"

rpc:

  "*":
    provide: true
    request: true

  a-provide-b-request:
    provide: "user.id === 'client-a'"
    request: "user.id === 'client-b'"

  only-full-user-data:
    request: "typeof data.firstname === 'string' && typeof data.lastname === 'string'"
```
