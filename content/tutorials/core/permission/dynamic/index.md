---
title: Dynamic Permissions using Valve
description: Realtime permissions that are readable on both client and server
tags: [tutorial, realtime, permissions, server, client]
---
Oh dear...permissions! Permissions are always super-hard to explain. I've read tutorials using The Simpsons, The Fellowship of the Ring and even the Olsen Twins to explain concepts like "access groups" and "right-inheritance".

With deepstream, things can be equally tricky at times - but for different reasons. deepstream is a realtime server. And even its permissions can be - if you want them to be - shared with both clients and servers in realtime.

The good news is that deepstream makes realtime permissions extremely easy using a permission language called "Valve". This tutorial assumes that you already know your way around Valve. If you haven't come across it yet, make sure to read the [Simple Valve](/tutorials/core/permission-conf-simple/) and [Advanced Valve](/tutorials/core/permission-conf-advanced/) tutorials first.

## But hold on: Why would I want realtime permissions?
A lot of times you'll want the same set of permissions in two places:

-On the server to enforce the permission-rules within a trusted environment.

-On the client to provide instant validation and a defensive design that avoids user frustration by making forbidden options unavailable.

As permissions change - e.g. a user being kicked out of a chat-group or a trader no longer being allowed to buy a certain stock - you'd want those permissions not only to take effect immediatly, but also gently and gracefully remove the associated options from the client's UI - the exact  moment they become unavailable.


## The goal of this tutorial
This tutorial won't be using The Simpsons or any other metaphor. Instead, it will use colors (hurray!). Here's what we want to achieve:

there will be three users and one admin with individual credentials 
![Screenshot login form](login.png)

there is one global color [record](/tutorials/core/datasync-records/) that can be set by any user to red, green or blue

each user gets three buttons, one for each color. When clicked, they set the global color.
![Screenshot user GUI](user.png)

the admin user can decide which user is allowed to set the global color to which value
![Screenshot Admin User GUI](admin.png)

Any change to a user's permission needs to reflect on their GUI in realtime and needs to be enforcable by the server

![Animation interaction](deepstream-dynamic-permissions.gif)

Please note: You can find the [code for this example on Github](https://github.com/deepstreamIO/ds-tutorial-dynamic-permissions)

## Login
To keep things simple we'll be using [file-authentication](/tutorials/core/auth-file/) and cleartext passwords. To enable file-based authentication, configure it in the `auth` section of your server's `config.yml`.

```yaml
auth:
  type: file
  options:
    path: ./users.yml # Path to the user file. Can be json, js or yaml
    hash: false # false indicates that we're using cleartext passwords
```

Every user has associated metadata that will be shared with both Valve and the client for permissioning. Here's what this will look like:

```yaml
# User A
userA:
  password: "usera-pass"
  serverData:
    permissionRecord: "permissions/usera"
    role: "user"
  clientData:
    permissionRecord: "permissions/usera"
    role: "user"
```

a few things to note:

- this data is stored in `users.yml`
- the data is specified twice. `serverData` will be available within Valve rules as `user.data`, `clientData` will be passed as the second arguments to succesful `login()` callbacks.
- `role` can either be `user` or `admin`. Admins will be shown the admin GUI on the client and are allowed to set a user's permissions. Users can set the global color - if they are permissioned to set it to a particular value.
- `permissionRecord` is the name of a record that will contain the actual permission information in the following format:
```javascript
{
    red: true,
    blue: true,
    green: false
}
```

## The permissions
Our permissions are stored in a file called `permissions.yml` [please find the entire file here](https://github.com/deepstreamIO/ds-tutorial-dynamic-permissions/blob/master/server-config/permissions.yml). The section on records will look as follows

```yaml
record:
  "*":
    create: true
    write: true
    read: true
    delete: false
    listen: false

  "global-color":
    write: "_(user.data.permissionRecord)[data.color]"

  "permissions/*":
    write: "user.data.role === 'admin'"
```

### Default permissions
Lets look at this file step: In general we allow everything, but turn off deletion and listening to records as these features won't be used in our example. Depending on your approach it might be a better choice to deny everything by default and only explicitly allow interactions.

```yaml
"*":
    create: true
    write: true
    read: true
    delete: false
    listen: false
```

### Allowing users to set global color
Here we decide whether a user is allowed to set the global color to a specific value. `user.data.permissionRecord` is the name of the permission-record specified in our `users.yml` file's `serverData` section.

`_()` is the cross-reference-function used to load a record's data into our permission rule. `data.color` is the color value in the incoming data the user tries to write.

```yaml
  "global-color":
    write: "_(user.data.permissionRecord)[data.color]"
```

### Allowing only admins to set permissions
Next up we need to make sure that only admins can set a user's permission. Similar to before we check for every write to any of the permission records (`permissions/usera` etc.) if the role of the one attempting the write is `admin`.
```yaml
  "permissions/*":
    write: "user.data.role === 'admin'"
```

## To summarize
This mechanism is all we need to ensure the above permissions on both client and server. Everytime a user tries to write to the `global-color` record, her permissions are checked accordingly. Everytime an admin enables or disables a permission, the associated button on the user's GUI is turned on or off.
