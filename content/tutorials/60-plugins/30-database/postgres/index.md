---
title: Postgres DataBase Connector
description: Learn how to use Postgres with deepstream
logoImage: postgres.png
tags: [postgres, postgresql, deepstream, realtime, search]
---

## What is Postgres?
[PostgreSQL](https://www.postgresql.org/) or Postgres for short is a relational database management system, similar to MySQL or Oracle. With development starting as early as 1986 and continuous improvement ever since it is as mature and established as databases go and has become one of the most solid and reliable cornerstones of the database world.

![Postgres deepstream](postgres-deepstream.svg)
But that doesn’t mean that Postgres is complicated or old fashioned. Over the years it has evolved from a simple relational database into a powerful data programming platform with elaborate stored procedures, trigger functions, a myriad of datatypes and powerful querying capabilities.

## Why you should use Postgres as a database for deepstream
Postgres is established, reliable and rock solid. But it’s especially its newer functionality that makes it a great fit for deepstream:

- It’s support for binary JSON allows for efficient storage and searching of deepstream records
- It’s built-in notification mechanism allows to run pub-sub and realtime events based on data-changes, a feature supported by `deepstream.io-storage-postgres`
- It’s extensively programmable in C, Python, Perl or Postgres own PL/pgSQL
-It allows to automatically organize deepstream’s data into tables created on the fly with very little overhead
- Combining triggers, jsonb-queries and notifications allows for the creation of realtime querying capabilities with streaming results

## Why you should not use Postgres as a database for deepstream
deepstream’s data-structures are schemaless JSON documents identified by a unique key. This makes object-oriented databases a more natural fit as deepstream won’t make much use of Postgres relational features. Beyond that, there’s not much negative to say: Postgres is solid, fast and available from many hosting companies, e.g. [AWS](https://aws.amazon.com/rds/postgresql/) or [Heroku](https://www.heroku.com/postgres) as well as under a very [permissive open source license](https://www.postgresql.org/about/licence/) - give it a go!

## How to use deepstream with Postgres
deepstream comes preinstalled an official connector for postgres.


It can be configured in the `plugins - storage` section of deepstreams `config.yml`

```yaml
plugins:
  storage:
    name: postgres
    options:
      user: some-user
      database: some-database
      password: some-password
      host: localhost
      port: 5432 #postgres default post
      schema: ds #schema defaults to ds. Will be created if it doesn't exist
      max: 10 #concurrent connections
      idleTimeoutMillis: 30000 #timeout after which connection will be cut
      writeInterval: 200 #amout of milliseconds during which writes will be buffered
      notifications:
        CREATE_TABLE: true #Get notified when tables are created
        DESTROY_TABLE: true #Get notified when tables are dropped
        INSERT: true # Get notified when records are created
        UPDATE: false # Get notified when records are updated
        DELETE: true # Get notified when records are deleted
```

This connector can also be used as a standalone component from node.js to connect to postgres' notification mechanism. To do this, install the connector via

```bash
npm install @deepstream/storage-postgres --save
#or
yarn add @deepstream/storage-postgres
```

and instantiate it directly

```javascript
const PostgresConnector = require( '@deepstream/storage-postgres' );
const settings = {
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt( process.env.PG_PORT, 10 )
}

const connector = new PostgresConnector( settings )

// start connector
connector.init()

connector.on( 'ready', ()=>{
    connector.subscribe( event =>{
        //event will be a map of event and table for CREATE_TABLE and DESTROY_TABLE
        // { event: 'CREATE_TABLE', table: 'some-table' })
        // or of event, table and key for INSERT, UPDATE AND DELETE, e.g.
        // { event: 'INSERT', table: 'some-table', key: 'some-key' }
    }, err => { if( err ) throw err; })

    //subscriptions can be removed
    connector.unsubscribe(( err )=>{ /* done */ })

    // the connector also comes with a facility to get a map of all tables and the numbers of items within
    connector.getSchemaOverview(( err, result ) => {
        /* result will be e.g.
        {
            'some-table': 2,
            'some-other-table': 1,
            'new-table': 1,
            'table-a': 2,
            'table-b': 2
        }
        */
    })
})
```

## The API at a glance
### constructor(options)
Create the Connector, see above for options

### destroy(callback)
Destroy the connector. Callback will be invoked once complete

### createSchema(name, callback)
Create a new schema. The schema specified in the constructor options will be implicitly created. Default schema is 'ds'

### destroySchema(name, callback)
Destroys an existing schema

### getSchemaOverview(callback, name)
Returns a map of tables to their number of rows (see above for example). Name is optional, if omitted, the schema from the options will be used

### subscribe(callback, done, schema)
Subscribe to notifications from the schema. Which notifications you'll receive is determined by the `notifications` option passed to the constructor. callback will be invoked with notifications in the format `{ event: 'INSERT', table: 'some-table', key: 'some-key' }`, done will be called once the subscription is established. Schema is optional.

### unsubscribe(callback, done, schema)
Removes a previously registered callback or all listeners if callback is omitted. Schema is optional

### set(key, version, value, callback)
Writes a value to the database. If key includes a `/` e.g. `cars/bmw`, the first part will be used to create a table and the second part as id. Value can be any JSON blob, callback will be invoked once the write is complete. Please note that reads are buffered and batched and might not be executed straight away.

### get(key, callback)
Retrieves a value from a database. Callback will be invoked with error or null, version and value. If record not found version will be -1.

### delete(key, callback)
Deletes a value from the database

### query(statement, callback, args, silent)
Low level query interface.  Statement is a PostgreSQL string, args an optional array of arguments for parameterized queries and silent = true ensures that errors are forwarded to the callback rather than thrown/logged.
