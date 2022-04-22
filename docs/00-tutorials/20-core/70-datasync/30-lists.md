---
title: Lists
description: Learn how you can use lists to create collections out of records with attributes in common
---

Lists are observable arrays of recordNames (not their data!).

Lists and recordNames have what a computer science teacher would call an n:m-relationship - a list can contain many recordNames and a recordName can be part of many lists.

To make life easier, lists come with all sorts of convenience methods. You can add an entry at a specific index using `addEntry(recordName, index)`, remove entries from anywhere within the list using `removeEntry( recordName)`, set or get all entries or check if the list `isEmpty()`.

Apart from that, lists are quite similar to [records](../records/). They notify you `whenReady()`, can be `subscribe()` to and need to be `discard()` after usage.

## What are lists useful for?
Lists are used whenever records need to be combined into collections. Let's take the infamous [TodoMVC](http://todomvc.com/) for example. When built with deepstream, each task would be a record, containing the `title` and a `completed` flag.

![records in todo list](/img/tutorials/20-core/todolist-record.png)

Each record is identified by a unique name, e.g. `todo/ikfndiqx-43jdj23bsdf`.

The `todo/` part of the name identifies the category the record belongs to and specifies the table within the database it will be stored in. It does however NOT automatically add the record to a list of todos.

To organize our tasks in a list called `todos`, we would need to explicitly create it using

```javascript
const todos = ds.record.getList( 'todos' );
```

and add our recordnames as entries

```javascript
todos.setEntries([
    'todo/ikfndidw-1973pnhmyk7',
    'todo/ikfndiqx-43jdj23bsdf',
    'todo/ikfndidt-5sdk3zag354'
]);
```

![todolist with list](/img/tutorials/20-core/todolist-list.png)

## Taking it a step further
deepstream is all about combining simple building blocks into powerful apps - and lists are no exception. Nesting references to lists within records and references to records within lists allows you to model your applications data-layer as a fully synced and observable tree structure.

![List - Record Tree Structure](/img/tutorials/20-core/tree-structure.png)

## Using lists with anonymous records
Lists are often used to power selection panels for [anonymous records](../anonymous-records/).

![simple app with anonymous record](/img/tutorials/20-core/simple-app-structure.png)

## Why do lists not contain or subscribe to the actual record data?
Records are more than just their data. They have their own subscribe/discard lifecycle which tends to be closely associated with the component that renders them. Naturally, this component is the best place to request the record and manage its lifecycle.

Recordnames are lightweight strings that can easily be passed around, e.g. as `props` to React components or as `data-model` to an Android listview.

This also addresses one of the major challenges of developing realtime apps: Using bandwidth efficiently and minimizing the amount of data that's send over the wire. One of the best ways to achieve this is by limiting subscriptions to the records that are currently in view. Lists help with that by providing the necessary structure to create infinite grids or panels that automatically load and discard data while the user scrolls.
