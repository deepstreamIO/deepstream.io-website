---
title: Interface RecordEventsListener
description: A listener that's notified whenever a record is deleted, or discarded
category: interface
navLabel: RecordEventsListener
body_class: dark
---

Record state changed listener, used to be notified whenever the record state has occurred

## Methods

### void onError(String recordName, Event errorType, String errorMessage)

```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record an error occured to
-
  arg: errorType
  typ: Event
  des: The error type, such as Event.ACK_TIMEOUT or Event.MESSAGE_DENIED
-
  arg: errorMessage
  typ: String
  des: An error message in english, describing the issue. Do not use this message other than for logging! All checks should be against errorType
{{/table}}
```
Notified whenever an error has occurred on the record, usually due to an async operation such as a timeout or VersionConflict that can't be caught sync.

### void onRecordDeleted(String recordName)


```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record that got deleted
{{/table}}
```
Notified when the record was deleted, whether by this client or by another.

Once this is called the record object must be cleaned up and a new one created if you wish to continue setting data.

### void onRecordDiscarded(String recordName)


```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record that got discarded
{{/table}}
```

Notified once the record was discarded.
Once this is called the record object must be cleaned up and a new one created if you wish to continue setting data.