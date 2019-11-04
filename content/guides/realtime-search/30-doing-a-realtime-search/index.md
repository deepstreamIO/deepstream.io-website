---
title: Realtime Search
description: Doing a realtime search
---

So now we get to the juicier part. Realtime Search works using a combination of the same basic deepstream record or lists APIs, so we don't really need to learn anything new!

The first thing you need to do is make an RPC in order to notify the backend of the query you want to perform. This step isn't entirely necessary as we could just put the query inside of the record or events name, however it provides two important aspects:

- permissions

You can easily permission an RPC using valve as we will see later. This makes it much more secure as we don't need to parse it and can also add meta data into the RPC to strengthen it further

- Size

If you have complex query odds are it's quite long. Normally you want to keep topics as short as possible as they are heavily used, and in some cases long names are not even supported by dbs (like rethinkdb)

If you used the previous realtime-search provider with rethinkdb this will be the only thing you need to change to upgrade

### Making an RPC

So the first thing we need to do is make the actual query, in this example we will have one that filters down
everyone in the user table with an age greater than 30 

```javascript
/**
 * In order to do the search we call an RPC with the table and query parameters
 * The query parameters are tuples of three:
 * 
 * [fieldName, operator, value]
 * 
 * Where the operators can be one of:
 * 
 * [ eq, ne, match, gt, ge, lt, le, in, contains ]
 * 
 * And you can AND them together by just having more:
 * 
 * [[fieldName, operator, value], [fieldName, operator, value], [fieldName, operator, value]]
 */
const hash = await client.rpc.make('realtime_search', {
    table: 'user',
    // age greater than equal to 30
    query: [['age', 'ge', 30]]
})
```

### Request the list

The next thing we need to do is request that hash and just to it updating. The simplest way to do this is:

```javascript
const resultList = client.record.getList(`realtime_search/list_${hash}`)
await resultList.whenReady()
resultList.subscribe(results => {
    console.log(results)
}, true)
```

However you'll notice the results are actually just record names like `user/uuid` rather than the data itself. This is because we use lists and hence realtime-search returns references to objects, but require the front-end to have to subscribe the individual records. This might sound sound like boiler plate but each application can request data differently depending on their goals. In this guide we'll concentrate on the most common approach of creating a record we can subscribe to it with the correct lifecycle hooks.

```javascript
const records = new Map()

const createRecord = async (recordName) => {
    const record = client.record.getRecord(recordName)
    records.set(recordName, record)
}

const discardRecord = (recordName) => {
    const record = records.get(recordName)
    record.discard()
    records.delete(recordName)
    dele
}

const resultList = client.record.getList(`realtime_search/list_${hash}`)
await resultList.whenReady()
resultList.forEach(createRecord)
resultList.on('entry-added', createRecord)
resultList.on('entry-removed', discardRecord)
```

### Rendering

Given the simplicity of this app and the lack of framework use I'm going to take the more unconventional route of rendering the list on animation request. It's definitely not the recommended approach in a bigger application, but I wanted to keep things as simple as possible

```javascript
const render = () => {
    const template = document.querySelector("#postit-template");
    const clone = document.importNode(template.content, true);
    const postit = clone.children[0];
    postit.style = `right: ${-100 * (index - 1)}px;`;
    postit.setAttribute("draggable", false);
    postit.setAttribute("data-type", POSTIT_TYPE[type]);
    postit.querySelector(".postit-copy").setAttribute("disabled", true);
    postit.onclick = e => {
    const type = e.currentTarget.getAttribute("data-type");
    addHeaderPostitClicked(type);
    };
    document
        .querySelector(".board-wrapper > header").appendChild(clone);

    requestAnimationFrame(render)
}

render()
```