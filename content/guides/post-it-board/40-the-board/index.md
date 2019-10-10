---
title: Grouping Post-Its Together
description: "Step five: Grouping Post-Its"
---

So we managed to create a postit which is kept in sync across multiple browsers. All thats left now is for us to be able to add more of them with different types.

In order to do this we will be using a deepstream data-sync concept called a list. It's essentially an array of strings that entries can be added and removed from and allows clients to organize and reference data in interesting ways.

Core concepts: 

- A list has a unique identifier. You can create your own or use `getUid()` to generate one for you: 

```javascript
const listName = client.getUid()
const list = client.record.getList(listName)
```

- You can set its entries:

```javascript
list.setEntries(['a', 'b', 'c'])
list.addEntry('d')
list.removeEntry('d')
```

- Get them:

```javascript
console.log(list.getEntries())
```

- Subscribe to changes:

```javascript
list.subscribe(entries => {
  console.log(`Board ${board.name} changed!`, entries)
})

list.on('entry-added', entry => {
    console.log(`Entry ${entry} added!`)
})

list.on('entry-removed', entry => {
    console.log(`Entry ${entry} removed!`)
})
```

So lets tie these into the board. What we want to do is:

- get a list
- render everything on that list initially
- whenever the list has a new postit added, render that as well
- add a new post-it onto the board
- delete all entries on the board

```javascript
const createAndMonitorPostits = () => {
    const list = client.record.getList('board')
    await list.whenReady()
    // Create postits that have already added
    list.getEntries().forEach(createPostit)
    // Create postits as they are added
    list.on('entry-added', createPostit)
}
```

Whenever a user clicks on a small postit in the header, we want to add that 
as a new postit to the board.

```javascript
const addPostitToBoard = async () => {
    const positId = client.getUid()
    createPostit(positId, { type: POSTIT_TYPE.MAD, position: { top: 0, left: 0 }, content: '' })

    const list = client.record.getList('board')
    await list.whenReady()
    list.addEntry(positId)
}
```

And finally, whenever a user clicks on the eraser the entire board will be wiped clean

```javascript
const clearBoard = async () => {
    const list = client.record.getList('board')
    await list.whenReady()
    await client.record.delete(list.getEntries()) // TODO: This API is still a WIP coming out in V5
    list.setEntries([])
}
```
