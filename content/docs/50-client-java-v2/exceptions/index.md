---
title: Exceptions
description: Java Client exceptions
category: exception
navLabel: All Client Exceptions
body_class: dark
---

## AnonymousRecordUninitialized

An exception that is thrown if a <code>AnonymousRecord.discard()</code> or <code>AnonymousRecord.delete()</code> is attempted before a record has been set via <a href="./AnonymousRecord#setName(name)"><code>AnonymousRecord.setName(name)</code></a>

## DeepstreamError

DeepstreamErrors are used for expected or handleable error cases, e.g. <a href="./RecordHandler#snapshot(recordName)"><code>RecordHandler.snapshot(recordName)</code></a> being called for a non-existant record.

## DeepstreamException

Deepstream runtime exception, e.g. response timeouts. These can be centrally caught using the <a href="./DeepstreamClient#setRuntimeErrorHandler(handler)"><code>DeepstreamClient.setRuntimeErrorHandler(handler)</code></a>.

### Fields

| Name        | Description  |
| ------------- |-------------|
|topic   | The Topic the event occured on |
| event     | The exception event |
| message | The exception message, explaning the issue in english for logging purposes |

## DeepstreamRecordDestroyedException

Called whenever an action on a discarded or deleted record is attempted. Retrieve a new instance of the Record using <a href="./RecordHandler#getRecord(recordName)"><code>RecordHandler.getRecord(recordName)</code></a> to continue using it.

## InvalidDeepstreamConfig

Thrown if any of the options passed to <code>DeepstreamClient(options)</code> are invalid, due to type or invalid enum.

## RecordMergeStategyException


Thrown when a version conflict occurs, and is only exposed to the client via <a href="./RecordEventsListener#onError(name,errorType,errorMsg)"><code>RecordEventsListener.onError(recordName, errorType, errorMessage)</code></a>


### Properties

| Name        | Type | Description  |
| ------------- |-------|------|
| newData   | <code>JsonElement</code> | The new data attempted to be set from the server |
| remoteVersion     | int | The version of the record on the server |
| oldData | JsonElement | The old data currently on the client |
| version | int | The version of the record on the client |
| error | String | The error message associated with merge conflict returned by a custom RecordMergeStrategy |

### Constructors

### RecordMergeStrategyException()

Use when you don't need any merge conflict data

### RecordMergeStrategyException(int localVersion, JsonElement oldData, int remoteVersion, JsonElement remoteData, String error)


```
{{#table mode="java-api"}}
-
  arg: localVersion
  typ: int
  des: The local version during the merge
-
  arg: oldData
  typ: JsonElement
  des: The local data during the merge
-
  arg: remoteVersion
  typ: int
  des: The remote version during the merge
-
  arg: remoteData
  typ: JsonElement
  des: The remote data during the merge
-
  arg: error
  typ: String
  des: An associated error message
{{/table}}
```
An exception that can contain all the merge issues


