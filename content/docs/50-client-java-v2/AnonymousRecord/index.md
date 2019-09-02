---
title: Class AnonymousRecord
description: An AnonymousRecord acts as a wrapper around an actual record, allowing it to be swapped whilst keeping all bindings intact
---

An AnonymousRecord is a record without a predefined name. It acts as a wrapper around an actual record that can be swapped out for another one whilst keeping all bindings intact.

This is useful to easily populate user-interface with data choosen from a list of entries.

Learn more about AnonymousRecords in [this tutorial](/tutorials/guides/anonymous-records/)

## Methods

### String name()

Returns the name of the underlying record the anonymous record is bound to.

```java
String recordName = anonymousRecord.name()
```

### AnonymousRecord setName(String recordName)

|Argument|Type|Description|
|---|---|---|
|recordName|String|The name of the underlying record to use|

Sets the underlying record the anonymous record is bound to. Can be called multiple times.

```java
anonymousRecord.setName('person/bob')
```

### AnonymousRecord addRecordNameChangedListener(AnonymousRecordNameChangedListener listener)

|Argument|Type|Description|
|---|---|---|
|listener|AnonymousRecordNameChangedListener|Listener to add|

Add a callback to be notified whenever setName(String) is called.

```java
anonymousRecord.addRecordNameChangedListener(...)
```

### AnonymousRecord removeRecordNameChangedCallback(AnonymousRecordNameChangedListener listener)

|Argument|Type|Description|
|---|---|---|
|listener|AnonymousRecordNameChangedListener|Listener to remove|


Remove a previously registered AnonymousRecordNameChangedListener

```java
anonymousRecord.removeRecordNameChangedCallback(...)
```
