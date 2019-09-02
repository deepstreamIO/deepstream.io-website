---
title: Interface RecordPathChangedCallback
description: A listener that's notified whenever the value of a path within a record changes
category: interface
navLabel: RecordPathChangedCallback
body_class: dark
---

Record data changed listener, used to be notified whenever the record data under a path has been modified either locally or remotely.

## Methods

### void onRecordPathChanged(String recordName, String path, JsonElement data)


```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record that changed
-
  arg: path
  typ: String
  des: The path that data changed within
-
  arg: data
  typ: JsonElement
  des: The data under the path as an Object
{{/table}}
```

Called when the listener is added via <a href="./Record#subscribe(path,callback,triggerNow)"><code>Record.subscribe(path,callback,triggerNow)</code></a>

Will contain the data under the path, regardless of whether triggered by a Patch or Update