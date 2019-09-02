---
title: Class RecordMergeStategy
description: A collection of strategies that will be applied to resolve data-conflicts
category: class
navLabel: RecordMergeStategy
body_class: dark
---

Allows users to reconcile record versions in case of data-conflict ( out of sync record versions )

## Methods

### JsonElement merge(Record record, JsonElement remoteValue, int remoteVersion) throws RecordMergeStrategyException


```
{{#table mode="java-api"}}
-
  arg: record
  typ: Record
  des: Used to retrieve the local version via record.version() and data via record.get()
-
  arg: remoteValue
  typ: int
  des: The remote value on the platform
-
  arg: remoteVersion
  typ: int
  des: The remote version on the platform, used to find out if the remote is ahead of the local
{{/table}}
```

Whenever a version conflict occurs the MergeStrategy set via <a href="./Record#setMergeStrategy(mergeStrategy)"><code>Record.setMergeStrategy(strategy)</code></a> will be called to merge the data and send the data back to the platform.

This is mainly used for scenarios such as when working on very collaborative records where messages cross on the wire, or for connection drops where the client still updates records in an offline mode.

Throw an error if the merge fails, but keep in mind that this only means it will postpone the merge conflict until the next remote/local update.