---
title: Interface AnonymousRecordNameChangedListener
description: A listener that's notified whenever an AnonymousRecord's name is changed
category: interface
navLabel: AnonymousRecordNameChangedListener
body_class: dark
---

A listener that notifies whenever <a href="./AnonymousRecord/#setName(name)"><code>AnonymousRecord.setName(name)</code></a> is called.

This is useful to easily populate user-interface with data choosen from a list of entries.

Learn more about AnonymousRecords in [this tutorial](/tutorials/guides/anonymous-records/)

## Methods

### void recordNameChanged(String name, AnonymousRecord anonymousRecord)


```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The new recordName
-
  arg: anonymousRecord
  typ: AnonymousRecord
  des: The anonymousRecord which name changed
{{/table}}
```
Notified whenever the underlying record changes
