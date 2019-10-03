---
title: Storage Authentication
description: A deepstream authentication mechanism that reads credentials and userdata via the storage adaptor
tags: [authentication, database, hash, crypto]
---

Storage-based authentication allows you to store usernames, password hashes and optional meta-data in a table within
your database that will be used to authenticate incoming connections.

## Using Storage-based authentication

To enable authentication to a deepstream server with user credentials stored in your database, set the `type` key to `storage` in the `auth` section of the server's [configuration file](/docs/server/configuration/).

```yaml
auth:
  type: storage
  options:
    table: 'User' # The table to store the user data in
    tableSplitChar: string # the split character used for tables (defaults to /)
    createUser: true # automatically create users if they don't exist in the database
    hash: 'md5' # the name of a HMAC digest algorithm
    iterations: 100 # the number of times the algorithm should be applied
    keyLength: 32 # the length of the resulting key
```

In the `hash` key add the hashing algorithm to hash the passwords, for example,
using `md5` (or any other algorithm supported by your operating system). The `iterations` key sets how many times the algorithm should be applied to the user's password, and `keyLength` is the length of the generated key. These should match how you hashed the passwords.

Start the deepstream server and you should see the authentication type confirmed.

![deepstream starting with storage authentication](ds-auth-storage-start.png)

In your application code you can now connect to the deepstream server and try to login a user.

```javascript
import { DeepstreamClient } = from '@deepstream/client'
const client = new DeepstreamClient('localhost:6020')

client.login({
  username: 'chris',
  password: 'password' // NEEDS TO BE REAL
})
```

If a success, the deepstream console will show:

![Authentication success](ds-auth-storage-success.png)

And if a failure:

![Authentication failure](ds-auth-storage-failure.png)

You can then handle the outcome of the login request in your JavaScript code, for example:

`embed: js/login-es5.js`
`embed: js/login-es6.js`

## User auto-registration

If you set `createUser` to true, deepstream will create a user for you automatically. This helps with
workflows where users can sign up to accounts without using a separate API.

![Created new users](ds-auth-storage-created-user.png)

If a user is created on their first login it's worth noting the following:

- ServerData is empty
- ClientData contains two fields:
  - The timestamp for when the user was created
  - The user id
- The username within deepstream is actually the userId and not the username

The assignment of an unique id for each user is extremely important for two reasons:

- It's used within presence, so whenever you do `client.presence.getAll()` or `client.presence.subscribe()`
you will be interacting with the generated user id rather than the username
- It's used within permissions, so will be used when you access the user id via `user.id`

So why use an id at all rather than the username? Because usernames are something people may want to change,
but uuids last forever. This way you have the option of setting up your applications without having to update
all the references within your database.

## Don't forget to apply permissions

Seriously, please don't! Since the database is open by default this means that any user can request or update
the data, which is a huge security issue.

The simplest way to add permissions is to just deny access to that table in Valve.

```
record:
  'YourUserTable/.*':
    create: false
    write: false
    read: false
    delete: false
    listen: false
    notify: false
```

So why not do internal magic to apply this automagically? Because if you apply your permissions correctly you can do some really cool stuff. For example, modifying the user data from an admin UI or deleting the user.

```
record:
  "YourUserTable/.*":
    write: "user.data.role === 'admin'"
    read: "user.data.role === 'admin'"
    delete: "user.data.role === 'admin'"
```

The users themselves shouldn't have access to the UserTable and do things via an RPC call in case of changing any of their data or password.

```javascript
import { DeepstreamClient } = from '@deepstream/client'
const client = new DeepstreamClient('localhost:6020')

async {
  await client.login({ username: 'a user with an admin role', password: '1234' })

  client.rpc.provide('change-user-details', async (data, response) => {
    const user = client.record.snapshot(`User/${data.username}`)
    // update user data
    await client.record.setData(`User/${data.username}`, user)
    response.send('Done')
  })
}
```