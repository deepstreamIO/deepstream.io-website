---
title: HTTP API
description: The reference for deepstreamHub's HTTP API
---

deepstreamHub's HTTP API provides access to a subset of the features available through the client
libraries, by making simple requests to our secure HTTPS endpoint.

You can batch multiple fetches, updates and RPCs into a single request for convienience. Messages are counted on a per message basis, meaning a HTTP post that emits 3 events would count as three individual messages. However they do not affect your connection limit allowing thousands of devices to get or set your application on any plan.

## Authentication

If your chosen auth strategy is email or webhook, the auth endpoint allows you to send
authentication data and returns a session token that can then be used for requests. 

If you're using open auth, you can just go ahead and make requests without a token.

To get your HTTP authentication URL, go to the [applications
page](https://dashboard.deepstreamhub.com/#/apps) on the deepstreamHub dashboard, then select your app.  The URLs are displayed in the "Admin" tab. You'll need to include this in the URL for all your requests.

### Auth Request

<div class="url-box">
<div class="post type">post</div>
<div class="url">&lt;YOUR HTTP AUTH URL&gt;</div>
</div>

The body is specified
For details on possible authentication data see 
[the authentication overview](/tutorials/guides/security-overview/#authentication).

Example body (email auth): 
```json
{
  "type": "email",
  "email": "fred.flintstone@example.com",
  "password": "y4b4d4b4d00"
}
```

Example request using cURL:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "type": "email",
  "email": "fred.flintstone@example.com",
  "password": "y4b4d4b4d00"
}
' "<YOUR HTTP AUTH URL>"
```

### Auth Response

A successful response will have a 200 status code and a JSON body with the following properties:

```
{{#table mode="api"}}
-
  par: "token"
  typ: string
  opt: false
  des: A generated auth token.

-
  par: "clientData"
  typ: object
  opt: false
  des: Any client data specified for the authenticated user.
{{/table}}
```

This auth token is valid for an unlimited number of requests, but will expire after 24 hours.

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

A token may be provided, either one fetched through the auth endpoint above, or one generated
through the dashboard.

### Request

<div class="url-box">
<div class="post type">post</div>
<div class="url">&lt;YOUR HTTP URL&gt;</div>
</div>

```
{{#table mode="api"}}
-
  par: "token"
  typ: string
  opt: true
  des: A valid auth token. Leave this out to use open auth.
-
  par: "body"
  typ: array
  opt: false
  des: A non-empty array of commands.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "result"
  typ: string
  opt: false
  des: &quot;SUCCESS&quot; if all commands returned success, &quot;PARTIAL\_SUCCESS&quot; if some failed, &quot;FAILURE&quot; otherwise.
-
  par: "body"
  typ: array
  opt: false
  des: A non-empty array of message responses.
{{/table}}
```


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

```
{{#table mode="api"}}
-
  par: "success"
  typ: boolean
  opt: false
  des: Whether the command executed successfully.
-
  par: "error"
  typ: string
  opt: true
  des: A description of the error that occurred (if any).
-
  par: "errorTopic"
  typ: string
  opt: true
  des: The topic of the error that occurred (if any) e.g. &quot;record&quot;.
-
  par: "errorEvent"
  typ: string
  opt: true
  des: The event corresponding to the error (if any) e.g. &quot;RECORD\_NOT\_FOUND&quot;.
{{/table}}
```

Example response:
``` json
{
  "success": true
}
```

### Emitting an event

If successful response means that the request was permissioned correctly.

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;event&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;emit&quot;.
-
  par: "eventName"
  typ: string
  opt: false
  des: The name of the event subscription e.g. &quot;frog&quot;.
-
  par: "data"
  typ: JSON
  opt: true
  des: A data payload e.g. { &quot;obj&quot;&#58; 3 } or &quot;string&quot;.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;record&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;read&quot;.
-
  par: "recordName"
  typ: string
  opt: false
  des: The name of the record e.g. &quot;cities/hamburg&quot;.
{{/table}}
```

Example:
``` json
{
  "topic": "record",
  "action": "read",
  "recordName": "my-record"
}
```

Non-standard response properties:

```
{{#table mode="api"}}
-
  par: "version"
  typ: integer
  opt: true
  des: The version of the record that was read.
-
  par: "data"
  typ: string
  opt: true
  des: The current data that was read.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;record&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;head&quot;.
-
  par: "recordName"
  typ: string
  opt: false
  des: The name of the record e.g. &quot;cities/hamburg&quot;.
{{/table}}
```

Example:
``` json
{
  "topic": "record",
  "action": "head",
  "recordName": "my-record"
}
```

Non-standard response properties:

```
{{#table mode="api"}}
-
  par: "version"
  typ: integer
  opt: true
  des: The version of the record that was read.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;record&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;write&quot;.
-
  par: "recordName"
  typ: string
  opt: false
  des: The name of the record e.g. &quot;cities/hamburg&quot;.
-
  par: "path"
  typ: string
  opt: true
  des: The record path.
-
  par: "version"
  typ: integer
  opt: true
  des: The version to be written. Defaults to -1 (force write).
-
  par: "data"
  typ: JSON
  opt: false
  des: The data to be set. If no path is set, this must be an object.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "currentVersion"
  typ: integer
  opt: true
  des: On version conflict, the existing version.
-
  par: "currentData"
  typ: JSON
  opt: true
  des: On version conflict, the existing data.
{{/table}}
```


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

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;record&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;delete&quot;.
-
  par: "recordName"
  typ: string
  opt: false
  des: The name of the record e.g. &quot;cities/hamburg&quot;.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "topic"
  typ: string
  opt: false
  des: Must have value &quot;rpc&quot;.
-
  par: "action"
  typ: string
  opt: false
  des: Must have value &quot;make&quot;.
-
  par: "rpcName"
  typ: string
  opt: false
  des: The name of the RPC to call.
-
  par: "data"
  typ: JSON
  opt: true
  des: The RPC data argument.
{{/table}}
```

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

```
{{#table mode="api"}}
-
  par: "data"
  typ: JSON
  opt: true
  des: On success, RPC result.
{{/table}}
```

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

Example request:
```json
{
  "topic": "presence",
  "action": "query"
}
```

Non-standard response properties:

```
{{#table mode="api"}}
-
  par: "users"
  typ: array
  opt: true
  des: An array of logged-in users.
{{/table}}
```

Example response:
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

