---
title: Interface ListChangedListener
description: A listener that's notified whenever any change to a list occurs
category: interface
navLabel: ListChangedListener
body_class: dark
---

List change callback, invoked for every change to the list

## Methods

### void onListChanged(String listName, java.util.List entries)


```
{{#table mode="java-api"}}
-
  arg: listName
  typ: String
  des: The name of the list that changed
-
  arg: entries
  typ: List<String>
  des: A list containing all the record names
{{/table}}
```

Notified whenever the entries in the list change