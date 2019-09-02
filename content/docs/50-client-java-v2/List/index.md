---
title: Class List
description: An observable collection of record names, useful to model relational structures
category: class
navLabel: List
body_class: dark
---
A List is a specialised Record that contains an Array of recordNames and provides a number of convinience methods for interacting with them.


## Methods


### Boolean isReady()

True if the list's initial data-set has been loaded from deepstream

### Boolean isDestroyed()

Return whether the list has been destroyed. If true it needs to be recreated via <a href="./RecordHandler#getList(listName)"><code>RecordHandler.getList(listName)</code></a>

### int version()

Return the list version. This is solely used within a <a href="./RecordMergeStrategy"><code>RecordMergeStrategy</code></a>

### String name()

Return the list name

### List addRecordEventsListener(RecordEventsListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: RecordEventsListener
  des: The listener to add
{{/table}}
```
Adds a Listener that will be invoked whenever a discard, delete or error event occurs


### List removeRecordEventsListener(RecordEventsListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: RecordEventsListener
  des: The listener to remove
{{/table}}
```
Removes a Listener that was added via List#removeRecordEventsListener


### List<String> getEntries()

Returns the array of list entries or an empty array if the list hasn't been populated yet.

### List setEntries(List<String> entries)


```
{{#table mode="java-api"}}
-
  arg: entries
  typ: List<String>
  des: The recordNames to update the list with
{{/table}}
```
Updates the list with a new set of entries


### List removeEntry(String entry)


```
{{#table mode="java-api"}}
-
  arg: entry
  typ: String
  des: The entry to remove from the list
{{/table}}
```
Removes the first occurrence of an entry from the list

### List removeEntry(String entry, int index)


```
{{#table mode="java-api"}}
-
  arg: entry
  typ: String
  des: The entry to remove from the list
-
  arg: index
  typ: Int
  des: The index at which the entry should reside at
{{/table}}
```

Removes an entry from the list if it resides at a specific index


### List addEntry(String entry)


```
{{#table mode="java-api"}}
-
  arg: entry
  typ: String
  des: The entry to add to the list
{{/table}}
```

Add an entry to the end of the list


### List addEntry(String entry, int index)


```
{{#table mode="java-api"}}
-
  arg: entry
  typ: String
  des: The entry to add from the list
-
  arg: index
  typ: Int
  des: The index at which the entry should reside at
{{/table}}
```

Adds an entry to the list at a specific index


### boolean isEmpty()

Returns true if the list is empty

### List subscribe(ListChangedListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: ListChangedListener
  des: The listener to add
{{/table}}
```

Notifies the user whenever the list has changed


### List subscribe(ListChangedListener listener, boolean triggerNow)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: ListChangedListener
  des: The listener to add
-
  arg: triggerNow
  typ: boolean
  des: Whether to trigger the listener immediately
{{/table}}
```

Notifies the user whenever the list has changed, and notifies immediately if triggerNow is true


### List unsubscribe(ListChangedListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: ListChangedListener
  des: The listener to remove
{{/table}}
```

Removes the listener added via subscribe(listener, triggerNow)


### List subscribe(ListEntryChangedListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: ListEntryChangeListener
  des: The listener to add
{{/table}}
```

Add a listener to notify the user whenever an entry is added, removed or moved within the list


### List unsubscribe(ListEntryChangedListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: ListEntryChangeListener
  des: The listener to remove
{{/table}}
```

Remove the listener added via subscribe(listEntryChangeListener)