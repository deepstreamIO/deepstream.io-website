---
title: Interface ListEntryChangedListener
description: A listener that's notified whenever entries are added, removed or moved within a List
category: interface
navLabel: ListEntryChangedListener
body_class: dark
---

List entry callbacks, called whenever an entry is added, removed or moved within the list

## Methods

### void onEntryAdded(String name, String entry, int position)


```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The name of the list that changed
-
  arg: entry
  typ: String
  des: The entry that has been added
-
  arg: position
  typ: int
  des: The index of the item added
{{/table}}
```

Notified whenever an entry is added

### void onEntryRemoved(String name, String entry, int position)


```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The name of the list that changed
-
  arg: entry
  typ: String
  des: The entry that has been removed
-
  arg: position
  typ: int
  des: The index of the item removed
{{/table}}
```
Notified whenever an entry is removed

### void onEntryMoved(String name, String entry, int position)


```
{{#table mode="java-api"}}
-
  arg: name
  typ: String
  des: The name of the list that changed
-
  arg: entry
  typ: String
  des: The entry that was moved within the list
-
  arg: position
  typ: int
  des: The index of the item was moved to
{{/table}}
```

Notified whenever an entry is moved