---
title: Creating postits
description: "Step four: Creating a postit"
---

## Creating a postit

Okay so in the skeleton provided earlier we have a basic function to allow postits to be created as follows:

```javascript
addPostit('postit/uuid', POSTIT_TYPE.SAD /** or POSTIT_TYPE.MAD or POSTIT_TYPE.HAPPY **/, newContent => {})
```

Doing that simply just adds a static postit onto the board. You can edit the content via

```javascript
updatePostitContent('postit/uuid', 'Hey, new content!')
```

And move the postit around the board by doing

```javascript
updatePostitPosition('postit/uuid', {
  left: 200,
  top: 200
})
```

## Creating a postit

Now comes the fun part—getting all the cards to remain in sync across all browsers/phones. Let’s take a step back and first look at data-sync and how it is used. We’ll be using [records](/tutorials/core/datasync/records/) to represent each indivudal postit. A record is just a convenient way of storing and manipulating JSON with data-sync built in.

Core concepts: 

- A record has a unique identifier. You can create your own or use `getUid()` to generate one for you: 

```javascript
const recordName = client.getUid()
const record = client.record.getRecord(recordName)
```

- You can set its data:

```javascript
record.set({
  owner: 'john'
  position: {
    left: 375,
    top: 250
  },
  content: 'This card is awesome!',
  type: 'glad'
});
```

- Get data:

```javascript
console.log(record.get())
```

- Subscribe to changes:

```javascript
record.subscribe(data => {
  console.log(`Card ${record.name} changed!`, data)
})
```

So let us tie these in. Lets say we want to create a postit, what we would do is:

```javascript
const createPostit = async (postitUid, initialData) => {
    const record = client.record.getRecord(postitUid)
    await record.whenReady()

    if (initialData) {
        record.set(initialData)
    }

    const postit = addPostit(
        postitUid, 
        record.get(), 
        newContent => record.set('content', newContent), 
        newPosition => record.set('position', newPosition)
    )

    record.subscribe('content', content => updatePostitContent(postitUid, content), true)
    record.subscribe('position', position => updatePostitPosition(postitUid, position), true)
}
```

Let us try that out now across two browsers to make sure it works as we expect

```javascript
createPostit('postit/uuid')
```

And now we have a postit that we can edit, and drag around the screen. This is great, as it means things are in sync and working exactly how expect.

Note how we don't update the dom directly from the drag function. This is because we are using the record as our single source of truth. By doing so, our code will process things the same way, regardless of whether the action happened remotely or locally. This is a great way to consume changes—otherwise, your code will become cluttered with unwanted conditions.


