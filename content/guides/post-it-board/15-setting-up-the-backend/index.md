---
title: Setting up the postit backend
description: "Step two: Starting the postit services"
---

`markdown:deepstream-backend-guide.md`

### Install MongoDB

Using mongodb with deepstream is a breeze, since mongo is a schemaless database there isn't much at all we need to configure.

First things first, you need to run mongodb. You can do this by either:

- Running it via docker (as always, the easiest way):

```
docker run -p 27017:27017 mvertes/alpine-mongo
```

- Follow the [install docs](https://docs.mongodb.com/manual/installation/)

One you have it up and running you would need to add it to deepstream, the easiest way of doing this is adding the following to your `config.yml` file:

```
storage:
  name: mongodb
  options:
    connectionString: mongodb://localhost:27017/deepstream
    database: deepstream
```

And start deepstream! You should see this in your startup logs:

```
INFO | storage ready: @deepstream/storage-mongodb
```

If you see the error

```
Error: Cannot load module @deepstream/storage-mongodb or deepstream.io-storage-mongodb
```

It means you are running it via node directly which means you just need to run

```
npm install --save @deepstream/storage-mongodb
```
