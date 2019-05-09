---
title: MongoDB DataBase Connector
description: Learn how to use MongoDB with deepstream
---

#### What is MongoDB?
MongoDB is one of the most widely adopted NoSQL databases. It stores documents in a binary version of JSON, scales via clustering and boosts a lot of features designed for speed, such as a low-level TCP API and a built-in, intermediate caching layer.
 MongoDB is free and open-source under GNU GPL and Apache License, and hosts a variety of features that gears itself towards good consistency and partition tolerance.

#### Why use MongoDB with deepstream
MongoDB can be used with deepstream as a storage solution for record data. Since deepstream is designed to structure data in JSON blobs, identified by a primary key, a NoSQL database like MongoDB is more suitable compared to relational databases like MySQL. MongoDB excels at performance and is appropriate for dynamic queries and data that changes on a frequent basis.

#### Downsides?
MongoDB is very established, being the most popular object-oriented database model and the 4th most used after Oracle, MySQL and Microsoft SQL. It does however not come with any build in support for realtime queries or output streams (although some approaches of hooking into it's [Operational Log](https://docs.mongodb.com/manual/core/replica-set-oplog/) exist)

#### Using MongoDB with deepstream.io
deepstream can connect to MongoDB using the "MongoDB storage connector", a plugin that connects to the database and automatically syncs incoming and outgoing record updates.

**Installing the MongoDB storage connector**

You can install the mongodb connector via deepstream's commandline interface, using:

```bash
deepstream install storage mongodb
```

or in windows
```bash
deepstream.exe install storage mongodb
```

resulting in deepstream MongoDB connector install command line output.

If you're using deepstream's Node.js interface, you can also install it as an [NPM module](https://www.npmjs.com/package/deepstream.io-storage-mongodb)

**Configuring the MongoDB storage connector**
You can configure the storage connector plugin in deepstream with the following options:

```yaml
storage:
  name: mongodb
  options:
    connectionString: ${MONGODB_CONNECTION_STRING}
    # optional database name, defaults to `deepstream`
    database: 'someDb'
    # optional table name for records without a splitChar
    # defaults to deepstream_records
    defaultTable: 'someTable'
    # optional character that's used as part of the
    # record names to split it into a tabel and an id part
    splitChar: '/'
```

