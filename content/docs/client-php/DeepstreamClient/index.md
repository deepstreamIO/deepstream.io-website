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

|Argument|Type|Optional|Description|
|---|---|---|---|
|$url|String|false|Deepstream URL|
|$authData|Array|true|Auth token used for all your requests|

The DeepstreamClient class creates a client instance to be used for all methods calls. The token option required for the $authData is a session token returned from a previous request to the app's HTTP auth url ([see http authentication](//docs/http/v1/#authentication)) or generated via the deepstream's dashboards token auth type. If you're using open auth the the token is optional.

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

|Argument|Type|Optional|Description|
|---|---|---|---|
|$recordName|String|false|The name of the record e.g. "cities/hamburg"|
|$path|String|true|The record path|
|$data|JSONValue|true|The data to be set. If no path is set, this must be an object|

|Returns|Description|
|---|---|
|Boolean|The name of the record e.g. "cities/hamburg"|

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

|Argument|Type|Optional|Description|
|---|---|---|---|
|$recordName|String|false|The name of the record e.g. "cities/hamburg"|

|Returns|Description|
|---|---|
|JSONValue|Mixed return data. If the request succeed it returns the record object otherwise false|

Retrieves a Record previously created with the given name.

Example:
```php
$firstname = $client->getRecord( 'user/johndoe' )->firstname;
```
### deleteRecord( $recordName )

|Argument|Type|Optional|Description|
|---|---|---|---|
|$recordName|String|false|The name of the record e.g. "cities/hamburg"|

|Returns|Description|
|---|---|
|Boolean|true if the request was successful|

Deletes a record from the cache and storage.
Deletion will succeed even if the record does not exist.

Example:
```php
$client->deleteRecord( 'user/johndoe' );
```

### getRecordVersion( $recordName )

|Argument|Type|Optional|Description|
|---|---|---|---|
|$recordName|String|false|The name of the record e.g. "cities/hamburg"|

|Returns|Description|
|---|---|
|Number|The version number of the record|

The version property may be used to ensure updates are not based on stale data.
For an update to succeed, the version provided must be 1 greater than the current version,
otherwise a version conflict will occur. To force an update the version can be omited.

Example:

```php
$version = $client->getRecordVersion( 'user/johndoe' );
```

`markdown:glossary-record.md`

### makeRpc( $rpcName, [$data] )

|Argument|Type|Optional|Description|
|---|---|---|---|
|$rpcName|String|false|The name of the RPC to call|
|$data|JSONValue|true|The RPC data argument|

|Returns|Description|
|---|---|
|JSONValue|If the request succeed it returns the response from the RPC provider, otherwise false|

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

|Argument|Type|Optional|Description|
|---|---|---|---|
|$eventName|String|false|The name of the event subscription|
|$data|JSONValue|true|A data payload|

|Returns|Description|
|---|---|
|boolean|true if the request was successful.|

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

|Returns|Description|
|---|---|
|void||

Initiates a set of batch operations that will be executed as a single request. No actual request will be sent until executeBatch is called. All the methods called in a batch operation will return true and the result of all operations is returned by the executeBatch method.

Example:
```php
$client->startBatch();
// operations go here...
```

### executeBatch()

|Returns|Description|
|---|---|
|Object|The response of all operations.|

Executes a set of batch operations previously started.


Example:
```php
$client->startBatch();
$client->emitEvent( 'new-message', 'hey, what\'s up?' );
$client->getRecord( 'user/johndoe' );
$client->setRecord( 'user/mike', 'age', 12 );
$client->executeBatch();
```
