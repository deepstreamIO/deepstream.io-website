---
title: Class Record
description: The main object of deepstream's realtime datastore
category: class
navLabel: Record
body_class: dark
---

This class represents a single record - an observable dataset returned by <a href="./RecordHandler#getRecord(recordName)"><code>client.record.getRecord(recordName)</code></a>

{{>glossary record=true}}

<div></div>

## Methods

### boolean isReady()

Indicates whether the record data has been loaded from the platform.

### boolean isDestroyed()

Return whether the record data has been destroyed. To continue using the record it will need to be re-requested via <a href="./RecordHandler#getRecord(recordName)"><code>client.record.getRecord(name)</code></a>.

### int version()

Return the record version.

### String name()

Return the record name.

### Record addRecordEventsListener(RecordEventsListener listener)


```
{{#table mode="java-api"}}
-
  arg: listener
  typ: RecordEventsListener
  des: The listener to add
{{/table}}
```
Adds a Listener that will be invoked if a discard, delete or error event occurs.

```java
Record record = client.record.getRecord("users/A");
record.addRecordEventsListener(new RecordEventsListener() {
  public void onError(String recordName, Event errorType, String errorMessage) {
    // handle error
  }

  public void onRecordHasProviderChanged(String recordName, boolean hasProvider) {
    // handle provider changed
  }

  public void onRecordDeleted(String recordName) {
    // handle record deleted
  }

  public void onRecordDiscarded(String recordName) {
    // handle record discarded
  }
});
```


### Record removeRecordEventsListener(RecordEventsListener listener)

```
{{#table mode="java-api"}}
-
  arg: listener
  typ: RecordEventsListener
  des: The listener to remove
{{/table}}
```

Remove listener added via <a href="#addRecordEventsListener(listener)"><code>addRecordEventsListener(listener)</code></a>.


### Record setMergeStrategy(MergeStrategy strategy)

```
{{#table mode="java-api"}}
-
  arg: strategy
  typ: MergeStrategy
  des: The name of the built in merge strategy to use
{{/table}}
```
Set a merge strategy that comes with deepstream. These are currently LOCAL_WINS and REMOTE_WINS.

```java
record.setMergeStrategy(MergeStrategy.LOCAL_WINS); // always use local version during conflicts

record.setMergeStrategy(MergeStrategy.REMOTE_WINS); // always use remote version during conflicts
```


### Record setMergeStrategy(RecordMergeStrategy strategy)


```
{{#table mode="java-api"}}
-
  arg: strategy
  typ: RecordMergeStrategy
  des: The custom merge strategy to use
{{/table}}
```
Set a custom merge strategy for the record.

```java
class CustomMergeStrategy implements RecordMergeStrategy {
  public JsonElement merge(Record record, JsonElement remoteValue, int remoteVersion) throws RecordMergeStrategyException {
    // custom merge strategy logic here
    return null;
  }
}

record.setMergeStrategy(new CustomMergeStrategy());
```


### JsonElement get()

Gets the entire record data and should always return a JsonObject that might be empty.

```java
JsonObject data = record.get();
// {
//   "name": "Homer",
//   "lastname": "Simpson"
// }
```

### JsonElement get(String path)

```
{{#table mode="java-api"}}
-
  arg: path
  typ: String
  des: The location of the data to retrieve
{{/table}}
```

Gets the value at the path indicated. Because of the JSON library used, any values retrieved from the JsonObject will need to be cast accordingly, ie. `object.getAsString()` or `object.getAsInt()`.

```java
// with record data
// {
//  "name": "Yasser",
//  "pets": [ {
//    "type": "Dog",
//    "name": "Whiskey",
//    "age": 3
//  } ]
// }
// we can do
record.get("name") // JsonElement.getAsString()
record.get("pets[0]") // JsonElement.getAsJsonObject()
record.get("pets[0].age") // JsonElement.getAsInt()
```

### Record set(Object value) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: value
  typ: Object
  des: The value to set
{{/table}}
```

Set the value for the entire record.

Make sure that the Object passed in can be serialised to a JsonElement, otherwise it will throw a IllegalStateException. Best way to guarantee this is by setting Json friendly objects, such as Map. Since this is a root the object should also not be a primitive.

```java
JsonObject data = new JsonObject();
data.addProperty.addProperty("name", "Homer");
record.set(data);
```

### Record set(String path, Object value) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: path
  typ: String
  des: The path with the JsonElement at which to set the value
-
  arg: value
  typ: Object
  des: The value to set
{{/table}}
```
Set the value for a specific path in the Record data.

Make sure that the Object passed in can be serialised to a JsonElement, otherwise it will throw a IllegalStateException.

The best way to guarantee this is by setting Json friendly objects, such as Map.

```java
record.set("lastname", "Simpson");
```


### RecordSetResult setWithAck(Object data)

```
{{#table mode="java-api"}}
-
  arg: data
  typ: Object
  des: The value to set
{{/table}}
```

Set the value for the entire record.

Make sure that the Object passed in can be serialised to a JsonElement, otherwise it will throw a IllegalStateException. Best way to guarantee this is by setting Json friendly objects, such as Map. Since this is a root the object should also not be a primitive.

The <a href="./RecordSetResult"><code>RecordSetResult</code></a> returned by this function will contain an error string or null, indicating the write success.

```java
JsonObject data = new JsonObject();
data.addProperty("firstname", "Homer");
RecordSetResult result = record.setWithAck(data);
if (result.getResult() != null) {
  // handle error writing to record
}
```


### RecordSetResult setWithAck(String path, Object data)

```
{{#table mode="java-api"}}
-
  arg: path
  typ: String
  des: The path with the JsonElement at which to set the value
-
  arg: data
  typ: Object
  des: The value to set
{{/table}}
```

Set the value for a specific path in the Record data.

Make sure that the Object passed in can be serialised to a JsonElement, otherwise it will throw a IllegalStateException.

The best way to guarantee this is by setting Json friendly objects, such as Map.

The <a href="./RecordSetResult"><code>RecordSetResult</code></a> returned by this function will contain an error string or null, indicating the write success.

```java
RecordSetResult result = record.setWithAck("lastname", "Simpson");
if (result.getResult() != null) {
  // handle error writing to record
}
```


### Record subscribe(RecordPathChangedCallback callback) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: callback
  typ: RecordPathChangedCallback
  des: The listener to add
{{/table}}
```
Registers a callback that will be invoked whenever the record's value changes. Optionally passing the argument `true` will cause the callback to be invoked immediately with the records value.

```java
record.subscribe(new RecordChangedCallback() {
    @Override
    public void onRecordChanged(String recordName, JsonElement data) {
        // handle record changed
    }
});
```

### Record subscribe(String path, RecordPathChangedCallback callback) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: path
  typ: String
  des: The path with the JsonElement at which to set the value
-
  arg: callback
  typ: RecordPathChangedCallback
  des: The listener to add
{{/table}}
```
Registers a callback that will be invoked whenever anything in the records path changes. Optionally passing the argument `true` will cause the callback to be invoked immediately with the records value.

```java
record.subscribe("lastname", new RecordPathChangedCallback() {
  public void onRecordPathChanged(String recordName, String path, JsonElement data) {
    // handle path changed
  }
});
```

### Record subscribe(RecordChangeCallback callback) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: recordChangeCallback
  typ: RecordChangeCallback
  des: The listener to add
{{/table}}
```

Removes a subscription previously made using <a href="#subscribe(callback)"><code>subscribe(callback)</code></a>.

### Record unsubscribe(String path, RecordPathChangedCallback callback) throws DeepstreamRecordDestroyedException

```
{{#table mode="java-api"}}
-
  arg: path
  typ: String
  des: The path to unsubscribe from
-
  arg: callback
  typ: RecordPathChangedCallback
  des: The listener to remove
{{/table}}
```

Remove the listener added via <a href="#subscribe(path,callback)"><code>subscribe(path,callback)</code></a>.

### Record discard() throws DeepstreamRecordDestroyedException

Discards the record. This should be called whenever a part of an application no longer requires a record previously requested via <a href="./RecordHandler#getRecord(recordName)"><code>client.record.getRecord(recordName)</code></a>.

Calling discard  does not guarantee that all subscriptions will be unsubscribed.

If all usages of the same record have been discarded, the record will no longer be updated by deepstream and any further usages will require the record to be retrieved again via <a href="./RecordHandler#getRecord(recordName)"><code>client.record.getRecord(recordName)</code></a>

Once the record is successfully discard, the client will be notified via <a href="./RecordEventsListener#onRecordDiscarded(name)"><code>onRecordDiscarded(name)</code></a>

### Record delete() throws DeepstreamRecordDestroyedException

Deletes the record and notifies other users of its deletion. This in turn will force all clients to discard the record.

Once the record is successfully deleted, clients will be notified via <a href="./RecordEventsListener#onRecordDeleted(name)"><code>onRecordDeleted(name)</code></a>
