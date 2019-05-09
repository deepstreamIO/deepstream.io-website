---
title: Searching and Querying
description: How to search through deepstream's data
tags: [searching,querying,sql]
---

deepstream is a fast transactional realtime server, but doesn't store any data itself (except for an internal cache for faster access). It does however work with a wide array of databases and makes it easy to expose the underlying db's querying features.

Let's look at some examples:

## RethinkDB
deepstream comes with a pre-build connector to expose RethinkDB's realtime search capabilities as a dynamic [List](/tutorials/core/datasync-lists/).

To use it, [install RethinkDB as a storage option](/tutorials/integrations/db-rethinkdb/) and then use [our connector](https://github.com/deepstreamIO/deepstream.io-provider-search-rethinkdb) to use the database seamlessly in your applications.

Once you have followed the installation and setup instructions for the connector, you can start searching records.

First create some records to experiment with, this will be written to RethinkDB automatically:

```javascript
const newItem1 = client.record.getRecord('shoes/air')
newItem1.set({color: 'red', brand: 'Nike', price: 100})

const newItem2 = client.record.getRecord('shoes/classics')
newItem2.set({color: 'white', brand: 'Reebok', price: 90})

const newItem3 = client.record.getRecord('shoes/liga')
newItem3.set({color: 'green', brand: 'Puma', price: 110})
```

To search for all shoes that are less than 100, create a dynamic list name:

```javascript
const priceString = JSON.stringify({
  table: 'shoes',
  query: [
    [ 'price', 'lt', 100 ]
  ]
})
```

The `table` value matches the path set when creating the records, in this case, `shoes`.

And search the records:

```javascript
client.record.getList('search?' + priceString)
```

Try searching for all shoes that are green:

```javascript
const colorString = JSON.stringify({
  table: 'shoes',
  query: [
    [ 'color', 'match', '^green*' ]
  ]
})
const results = client.record.getList('search?' + colorString)
```

You can combine one or more conditions into the query. To search for shoes that are green **and** less than 100, change your query to the following:

```javascript
const colorPriceString = JSON.stringify({
  table: 'shoes',
  query: [
    [ 'color', 'match', '^green*' ],
    [ 'price', 'lt', 100 ]
  ]
})
const results = client.record.getList('search?' + colorPriceString)
```

Each condition is an array of `[ field, operator, value ]`, the supported operators are:

- `eq`: Equal to.
- `gt`: Greater than.
- `lt`: Less than.
- `ne`: Not equal to.
- `match`: A RegEx match.

It's a good idea to delete your queries when you're finished with them. Do this with:

```javascript
colorPriceString.delete()
```

## Elasticsearch

ElasticSearch can be accessed by creating a small provider process that makes it accessible as an RPC.

Start by [installing elasticsearch as a storage option](/tutorials/integrations/db-elasticsearch/).

Once you have followed the installation and setup instructions for the connector, you can start searching recorclient.

First create some records to experiment with, this will be written to Elasticsearch automatically:

```javascript
const newItem1 = client.record.getRecord('shoes/air')
newItem1.set({color: 'red', brand: 'Nike', price: 100})

const newItem2 = client.record.getRecord('shoes/classics')
newItem2.set({color: 'white', brand: 'Reebok', price: 90})

const newItem3 = client.record.getRecord('shoes/liga')
newItem3.set({color: 'green', brand: 'Puma', price: 110})
```

Then send the RPC call to the client:

```javascript
client.rpc.provide('search-color-for-brand', (brand, response) => {
  // Query ElasticSearch
  es.search({
    index: 'deepstream',
    q: 'brand=' + brand
 }).then((body) => {
    // Return result
    response.send(body.hits.hits.color)
  }, (error) => {
    //Return Error
    response.error(error.toString())
 })
})
```

Elasticsearch allows for complex search parameters, and you should read their [query-building documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html) for more details. You add all search parameters to the `q` parameter in the `es.search` method above. To search for shoes that are a particular color **and** less than 100, change your query to the following:

```javascript
q: 'color=' + color + '&price:[* to 100]'
```
