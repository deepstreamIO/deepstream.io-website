---
title: HTTP API
description: The reference for deepstream's HTTP API
---

deepstream's HTTP API provides access to a subset of the features available through the client
libraries, by making simple requests to our secure HTTPS endpoint.

You can batch multiple fetches, updates and RPCs into a single request for convienience. Messages are counted on a per message basis, meaning a HTTP post that emits 3 events would count as three individual messages. However they do not affect your connection limit allowing thousands of devices to get or set your application on any plan.

## Authentication

If your chosen auth strategy is webhook, the auth endpoint allows you to send
authentication data and returns a session token that can then be used for requests. 

If you're using open auth, you can just go ahead and make requests without a token.

### Auth Request

The body is specified
For details on possible authentication data see 
[the authentication overview](/tutorials/guides/security-overview/#authentication).

Example body: 
```json
{
  "email": "fred.flintstone@example.com",
  "password": "y4b4d4b4d00"
}
```

Example request using cURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "type": "email",
  "email": "fred.flintstone@example.com",
}
' "<YOUR HTTP AUTH URL>"
```

### Auth Response

A successful response will have a 200 status code and a JSON body with the following properties:

|Parameter|Type|Optional|Description|
|---|---|---|---|
|token|string|false|A generated auth token.|
|clientData|object|false|Any client data specified for the authenticated user.|

Example response: 
```json
{
  "success": true,
  "token": "aI2wYSh1FS_2WODD14bYZe1TfIyhAukl",
  "clientData": {
    "client": "data"
  }
}
```

4XX status codes denote a failure, and will have a plaintext body containing the error message.

## POST requests

POST requests allow you to batch an arbitrary number of updates or requests into a single message.
Deepstream commands are encoded using the format defined below.

The maximum message size is 1 megabyte.

A token may be provided via the auth endpoint above.

### Request

|Parameter|Type|Optional|Description|
|---|---|---|---|
|token|string|false|A valid auth token. Leave this out to use open auth.|
|body|array|false|A non-empty array of commands.|

Example body: 
```json
{
  "token": "d9GKJkkdsjyKJh832s69sg9dberbs6fd",
  "body": [
    {
      "topic": "event",
      "action": "emit",
      "eventName": "stock-update",
      "data": {
        "apples": 40,
        "bananas": 100,
        "pears": 60
      }
    },
    {
      "topic": "record",
      "action": "read",
      "recordName": "balance"
    }
  ]
}
```

Example request using cURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "token": "d9GKJkkdsjyKJh832s69sg9dberbs6fd",
  "body": [
    {
      "topic": "event",
      "action": "emit",
      "eventName": "stock-update",
      "data": {
        "apples": 40,
        "bananas": 100,
        "pears": 60
      }
    },
    {
      "topic": "record",
      "action": "read",
      "recordName": "balance"
    }
  ]
}
' "<YOUR HTTP URL>"
```

### Response

A response with a 200 status code will have a JSON body in the following format:

- Note: a 200 response does not indicate that the messages succeeded. Be sure to check the "result"
  property in the response body.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|result|string|false|"SUCCESS" if all commands returned success, "PARTIAL\_SUCCESS" if some failed, "FAILURE" otherwise.|
|body|array|false|A non-empty array of message responses.|

Example response:
```json
{
  "result": "PARTIAL_SUCCESS",
  "body": [
    {
      "success": true
    },
    {
      "success": false,
      "error": "Record read failed. Record \"balance\" could not be found.",
      "errorTopic": "record",
      "errorEvent": "RECORD_NOT_FOUND"
    }
  ]
}
```

Poorly formed requests and authentication errors will result in a plaintext response, with an
appropriate status code in the range 400...499.

## Command format

All commands must have the properties "topic" and "action", which define the operation.

Responses are typically have the following standard fields. Any others are defined below.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|success|boolean|false|Whether the command executed successfully.|
|error|string|true|A description of the error that occurred (if any).|
|errorTopic|string|true|The topic of the error that occurred (if any) e.g. "record".|
|errorEvent|string|true|The event corresponding to the error (if any) e.g. "RECORD\_NOT\_FOUND".|

Example response:
``` json
{
  "success": true
}
```

### Emitting an event

If successful response means that the request was permissioned correctly.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "event".|
|action|string|false|Must have value "emit".|
|eventName|string|false|The name of the event subscription e.g. "frog".|
|data|JSON|true|A data payload e.g. { "obj": 3 } or "string".|

Event example with numeric payload:
``` json
{
  "topic": "event",
  "action": "emit",
  "eventName": "lights-on",
  "data": 134.52
}
```

### Reading a record

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "record".|
|action|string|false|Must have value "read".|
|recordName|string|false|The name of the record e.g. "cities/hamburg".|

Example:
``` json
{
  "topic": "record",
  "action": "read",
  "recordName": "my-record"
}
```

Non-standard response properties:

|Parameter|Type|Optional|Description|
|---|---|---|---|
|version|integer|true|The version of the record that was read.|
|data|string|false|The current data that was read.|

Example response:

``` json
{
  "success": true,
  "version": 2,
  "data": {
    "foo": "bar"
  }
}
```

### Record head

Get the current version of a record.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "record".|
|action|string|false|Must have value "head".|
|recordName|string|false|The name of the record e.g. "cities/hamburg".|

Example:
``` json
{
  "topic": "record",
  "action": "head",
  "recordName": "my-record"
}
```

Non-standard response properties:


|Parameter|Type|Optional|Description|
|---|---|---|---|
|version|integer|true|The version of the record that was read.|

Example response:
``` json
{
  "success": true,
  "version": 2
}
```

### Creating or updating a record

Update a record. Records that do not already exist will be created.

The optional "path" property may be used to update only part of a record.

The "version" property may be used to ensure updates are not based on stale data. 
For an update to succeed, the version provided must be 1 greater than the current version (see
[head](#record-head)), otherwise a version conflict will occur.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "record".|
|action|string|false|Must have value "write".|
|recordName|string|false|The name of the record e.g. "cities/hamburg".|
|path|string|true|The record path.|
|version|integer|true| The version to be written. Defaults to -1 (force write).|
|data|JSON|false| The data to be set. If no path is set, this must be an object.|

Example:
``` json
{
  "topic": "record",
  "action": "write",
  "recordName": "users/123",
  "path": "firstname",
  "version": 6,
  "data": "Bob"
}
```

Non-standard response properties:

|Parameter|Type|Optional|Description|
|---|---|---|---|
|currentVersion|integer|true|On version conflict, the existing version.|
|currentData|JSON|true|On version conflict, the existing data.|

Example successful response:
```json
{
  "success": true,
}
```

Example version conflict:
```json
{
  "success": false,
  "error": "Record update failed. Version 6 exists for record \"users/123\".",
  "errorTopic": "record",
  "errorEvent": "VERSION_EXISTS",
  "currentVersion": 6,
  "currentData": {
    "firstname": "Alan",
    "lastname": "Smith"
  }
}
```

### Deleting a record

Delete a record from the cache and storage.

Deletion will succeed even if the record does not exist, but storage and cache errors may occur.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "record".|
|action|string|false|Must have value "delete".|
|recordName|string|false| The name of the record e.g. "cities/hamburg".|

Example:
``` json
{
  "topic": "record",
  "action": "delete",
  "recordName": "my-record"
}
```

### Making an RPC

Making a remote procedure call.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "rpc".|
|action|string|false|Must have value "make".|
|rpcName|string|false|The name of the RPC to call.|
|data|JSON|true|The RPC data argument.|

Example request:
```json
{
  "topic": "rpc",
  "action": "make",
  "rpcName": "add-two",
  "data": {
    "numA": 2,
    "numB": 5
  }
}
```

Non-standard response properties:

|Parameter|Type|Optional|Description|
|---|---|---|---|
|data|JSON|true|On success, RPC result.|

Example response:
```json
{
  "data": 7,
  "success": true
}
```


### Querying Online Users (Presence)

Presence allows you to retrieve a list of user ids that are online. 

Note: HTTP requests do not contribute to presence updates or queries. These details relate only to
  WebSocket clients.

|Parameter|Type|Optional|Description|
|---|---|---|---|
|topic|string|false|Must have value "presence".|
|action|string|false|Must have value "query".|
|names|array|true|Array of user names to query for presence.|

Example request for all users:
```json
{
  "topic": "presence",
  "action": "query"
}
```

Non-standard response properties:

|Parameter|Type|Optional|Description|
|---|---|---|---|
|users|array|false|An array of logged-in users.|

Example response when querying all users:
```json
{
  "success": true,
  "users": [
    "ac65902c-13ea-469c-91e6-2cdc8c31136d", 
    "fba85ac8-02bd-98a7-bb42-b2526243b562", 
    "aba325bd-dd23-aba4-3390-02763477453e"
  ]
}
```

Example request for some users:
```json
{
  "topic": "presence",
  "action": "query",
  "names": ["one", "two"]
}
```

Example response when querying specific users:
```json
{
  "success": true,
  "users":{
    "one":true,
    "two":false
    }
}
```

