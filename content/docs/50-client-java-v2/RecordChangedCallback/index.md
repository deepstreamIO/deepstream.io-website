---
title: Interface RecordChangedCallback
description: A listener that's notified whenever the data within a record changes
category: interface
navLabel: RecordChangedCallback
body_class: dark
---

Record data changed listener, used to be notified whenever the record data has been modified either locally or remotely.

## Methods

### void onRecordChanged(String name, JsonElement data)

```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The name of the record that changed
-
  arg: data
  typ: JsonElement
  des: The updated data
{{/table}}
```

Called when the listener is added via <a href="./Record#subscribe(callback,triggerNow)"><code>Record.subscribe(callback,triggerNow)</code></a>

Will contain the entire record data, regardless of whether triggered by a Patch or Update