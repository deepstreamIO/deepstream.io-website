---
title: PHP Client
description: API documentation for the deepstream.io PHP client
navLabel: DeepstreamClient
---

The deepstream PHP SDK enables PHP developers to create, read, update and delete records, emit events and make RPCs. It also provides a batch mode that allows to combine multiple operations into a single transaction.

Under the hood the PHP SDK is using the deepstream HTTP API to execute individual and batch requests.

## Installation
The deepstream PHP SDK can be installed via [composer](https://packagist.org/packages/deepstream/deepstream.io-client-php) as `composer require deepstream/deepstream.io-client-php` or browse the source on [Github](https://github.com/deepstreamIO/deepstream.io-client-php)

## Basic usage

```php
<?php

use deepstream\DeepstreamClient;

// Instanciates a client and emits an event
$client = new DeepstreamClient( '<YOUR APP\'s HTTP URL>', array());

$client->emitEvent( 'news/sports', 'something about football is happening');

```

## Creating the client
### DeepstreamClient( $url, $authData )

{{#table mode="api"}}
-
  arg: $url
  typ: String
  opt: false
  des: App HTTP URL available in your App Admin page
-
  arg: $authData
  typ: Array
  opt: true
  des: Auth token used for all your requests
{{/table}}

The DeepstreamClient class creates a client instance to be used for all methods calls. The token option required for the $authData is a session token returned from a previous request to the app's HTTP auth url ([see http authentication](https://deepstream.com/docs/http/v1/#authentication)) or generated via the deepstream's dashboards token auth type. If you're using open auth the the token is optional.

Examples:

```php
// Instanciates a client with token session
$client = new DeepstreamClient( '<YOUR APP\'s HTTP URL>', array(
    'token' => 'xxxx'
));

// Instanciates a client for an app that uses open auth
$client = new DeepstreamClient( '<YOUR APP\'s HTTP URL>', array());

```

## Methods
### setRecord( $recordName, [$path], $data )
```
{{#table mode="api"}}
-
  arg: $recordName
  typ: String
  opt: false
  des: The name of the record e.g. "cities/hamburg".
-
  arg: [$path]
  typ: String
  opt: true
  des: 	The record path.
-
  arg: $data
  typ: Various
  opt: true
  des: The data to be set. If no path is set, this must be an object.
{{/table}}
```

```
{{#table mode="api"}}
-
  ret: Boolean
  des: The name of the record e.g. "cities/hamburg".
{{/table}}
```

Updates a record. Records that do not already exist will be created.
The optional "path" param may be used to update only part of a record.

Examples:
```php
// Writing full data
$client->setRecord( 'user/johndoe', array(
    'firstname' => 'John',
    'lastname' => 'Doe',
    'age' => 32,
    'pets' => array( 'hamster', 'cat' )
));

// Writing partial data
$client->setRecord( 'user/johndoe', 'age', '33' );

```
### getRecord( $recordName )
```
{{#table mode="api"}}
-
  arg: $recordName
  typ: String
  opt: false
  des: 	The name of the record.
{{/table}}
```
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>Mixed return data. If the request succeed it returns the record object otherwise false.</dd>
</dl>

Retrieves a Record previously created with the given name.

Example:
```php
$firstname = $client->getRecord( 'user/johndoe' )->firstname;
```
### deleteRecord( $recordName )
```
{{#table mode="api"}}
-
  arg: $recordName
  typ: String
  opt: false
  des: 	The name of the record.
{{/table}}
```
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>true if the request was successful </dd>
</dl>

Deletes a record from the cache and storage.
Deletion will succeed even if the record does not exist.

Example:
```php
$client->deleteRecord( 'user/johndoe' );
```
### getRecordVersion( $recordName )
```
{{#table mode="api"}}
-
  arg: $recordName
  typ: String
  opt: false
  des: 	The name of the record.
{{/table}}
```
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>The version number of the record</dd>
</dl>

The version property may be used to ensure updates are not based on stale data.
For an update to succeed, the version provided must be 1 greater than the current version,
otherwise a version conflict will occur. To force an update the version can be omited.

Example:

```php
$version = $client->getRecordVersion( 'user/johndoe' );
```

`markdown:glossary-record.md`

### makeRpc( $rpcName, [$data] )
```
{{#table mode="api"}}
-
  arg: $rpcName
  typ: String
  opt: false
  des: The name of the RPC to call.
-
  arg: [$data]
  typ: Various
  opt: true
  des: The RPC data argument

{{/table}}
```
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>Mixed return data. If the request succeed it returns the response from the RPC provider, otherwise false.</dd>
</dl>

Executes a remote procedure call.

Examples:
```php
// with data
$twentyfour = $client->makeRpc( 'multiply-by-two', 12 );

$result = $client->makeRpc( 'new-order', array(
  'id' => 'sad1da1t6yt2-asd1',
  'quantity' => 2
));

// without data
$client->makeRpc( 'logout' );
```

`markdown:glossary-rpc.md`

### emitEvent( $eventName, [$data] )
```
{{#table mode="api"}}
-
  arg: $eventName
  typ: String
  opt: false
  des: The name of the event subscription
-
  arg: [$data]
  typ: Various
  opt: true
  des: A data payload

{{/table}}
```
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>true if the request was successful.</dd>
</dl>

Emits an event

Examples:
```php
// with data
$client->emitEvent( 'new-message', 'hey, what\'s up?' );

$client->emitEvent( 'sensors/garden', array(
  'temperature' => 23.6,
  'soil-moisture' => 12.7,
  'humidity' => 63
));

// without data
$client->emitEvent( 'ping' );

```

`markdown:glossary-event.md`

### startBatch()
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>void.</dd>
</dl>

Initiates a set of batch operations that will be executed as a single request. No actual request will be sent until executeBatch is called. All the methods called in a batch operation will return true and the result of all operations is returned by the executeBatch method.

Example:
```php
$client->startBatch();
// operations go here...
```

### executeBatch()
<dl>
  <dt><span class="returnLabel">Returns:</span></dt>
  <dd>An Object with the response of all operations.</dd>
</dl>

Executes a set of batch operations previously started.


Example:
```php
$client->startBatch();
$client->emitEvent( 'new-message', 'hey, what\'s up?' );
$client->getRecord( 'user/johndoe' );
$client->setRecord( 'user/mike', 'age', 12 );
$client->executeBatch();
```
