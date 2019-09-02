---
title: Class RecordHandler
description: The main access point for the creation of Records, Lists and Anonymous Records
category: class
navLabel: RecordHandler
body_class: dark
---

The factory method's for deepstream's realtime datastore concepts, such as <a href="#getRecord(recordName)"><code>getRecord(recordName)</code></a>, <a href="#getList(listName)"><code>getList(listName)</code></a>, provider functionality such as <a href="#listen(eventName,listener)"><code>listen(eventName,listener)</code></a> and single requests like <a href="#snapshot(recordName)"><code>snapshot(recordName)</code></a></p>

## Methods

### Record getRecord(String recordName)

```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record to get
{{/table}}
```
Returns an existing record or creates a new one. If creating a new one the record will not be in a ready state till it is loaded from the server.

```java
Record record = client.record.getRecord("users/A");
```


### List getList(String listName)

```
{{#table mode="java-api"}}
-
  arg: listName
  typ: String
  des: The name of the list to retrieve
{{/table}}
```
Returns an existing List or creates a new one. A list is a specialised type of record that holds an array of recordNames.

```java
Record record = client.record.getList("users");
```


### AnonymousRecord getAnonymousRecord()

Returns an <a href="./AnonymousRecord">AnonymousRecord</a>. An anonymous record is effectively a wrapper that mimicks the API of a record, but allows for the underlying record to be swapped without losing subscriptions etc.

This is particularly useful when selecting from a number of similarly structured records. E.g. a list of users that can be choosen from a list.

The only API differences to a normal record is an additional <a href="./AnonymousRecord#setName(name)"><code>setName(name)</code></a> method.

### SnapshotResult snapshot(String recordName)

```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record which data to retrieve
{{/table}}
```

Retrieves a <a href="./SnapshotResult">SnapshotResult</a> with the current record data. Using this doesn't subscribe the client to changes the way <a href="#getRecord(name)"><code>getRecord(name)</code></a> does.

```java
SnapshotResult result = client.record.snapshot("user/B");
```


### boolean has(String recordName) throws DeepstreamError

```
{{#table mode="java-api"}}
-
  arg: recordName
  typ: String
  des: The name of the record to check
{{/table}}
```
Returns a <a href="./HasResult">HasResult</a> that shows whether or not the record exists.

```java
HasResult result = client.record.has("user/C");
```


### void listen(String pattern, ListenListener listenCallback)" mode="opensource / enterprise

```
{{#table mode="java-api"}}
-
  arg: pattern
  typ: String
  des: The pattern to match events which subscription status you want to be informed of
-
  arg: listener
  typ: ListenListener
  des: The Listen Listener
{{/table}}
```

Allows to listen for record subscriptions made by this or other clients. This is useful to create "active" data providers, e.g. providers that only provide data for a particular record if a user is actually interested in it.

You can only listen to a pattern once, and if multiple listeners match the same pattern only a single one will be notified.

```java
client.event.listen("users/*", new ListenListener() {
  @Override
  public boolean onSubscriptionForPatternAdded(String subscription) {
    if (/* can provide */) {
      return true;
    } else {
      return false;
    }
  }

  @Override
  public void onSubscriptionForPatternRemoved(String subscription) {
    // handle unsubscription
  }
});
```


### void unlisten(String pattern)" mode="opensource / enterprise

```
{{#table mode="java-api"}}
-
  arg: pattern
  typ: String
  des: The pattern that has been previously listened to
{{/table}}
```

Remove the listener added via <a href="#listen(pattern,listener)"><code>listen(pattern,listener)</code></a>. This will remove the provider as the active provider and allow another provider to take its place.

```java
client.record.unlisten("users/*", listener);
```
