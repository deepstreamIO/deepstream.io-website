---
title: "Realtime Search" 
description: The Realtime Search Evolution
blogImage: /images/elton/elton-professor.png
---

Realtime Search is one of the most powerful realtime concepts out there, and have been slowly been finding themselves in modern applications, regardless of the underlying technology backing it.

We are proud to announce a new realtime-search process that runs next to deepstream, allowing users to create realtime functionality with barely any code, and with an extensible plugin architecture to support more databases in the future!

We'll begin our journey from a static HTTP request and end with the functionality provided
by deepstream and the realtime-search component. You can also skip to the [last section](#realtime-search-finally) if this is just too long!

### Important

The code presented in these examples is pseudo code which I haven't run, and have some helper functions
to minimize eye strain

- `doQuery`

Is what you would call to run a single query against your database, which would return the results as an array

- `makeRequest`

Is what you would call to make a HTTP request in your application, like a GET or POST

- `doSomethingWithData`

What your application would call once your data is loaded

- `database.table('users').on`

Is similar to mongodb changefeeds, which tells you whenever a table has been updated

### HTTP Requests

The most common technique is to perform a search is a HTTP GET with search parameters / POST with a body. It scales amazingly well with any deployment platform out there, caches results and just works.

Service:
```javascript
server.on('/search', async (req, res) => {
    const results = await doQuery(req)
    res.send(results)
})
```

Client:
```javascript
setInterval (() => {
    const result = await makeRequest('/search')
    doSomethingWithData(result)
}, 1000)
```

If you want to make your application update without having to refresh, you can just rerequest the data, either when a user 
performs a refresh action or on a set interval.

### Push Notifications / Events

Once you have an application that can load data-dynamically, you can go one step further and add an extremely simple push layer to allow your application to be told whenever data needs to be refreshed. This allows you to continue using all the benefits of a normal HTTP application (scalability and so forth) while also getting told when to update to 
provide quicker updates to the end user and ideally reduce the amount of polling.

Service:
```javascript
server.on('/search', async (req, res) => {
    const results = await doQuery()
    res.send(results)
})

// Emit an event whenever the client changes (pseduo code based on changelogs)
database.table('users').on('change', () => {
  deepstream.event.emit('users-changed')
})
```

Client:
```javascript
// Subscribe to the event on the client and redo query
deepstream.event.subscribe('users-changed', doSomethingWithData)
// Do query initially to get results
const results = await makeRequest('/search')
doSomethingWithData(results)
```

Pretty useful right? This means our users no longer have to request data manually, wait for a certain timeout, extensively  poll your systems (which does get a little expensive with large deployments and cloud providers) and you can still lean back on using your normal HTTP stack for development.

### Static Result Notifications

Blindly getting told that a table changed however is still an extremely coarse action, specially the larger your table gets. You would most likely want to add some form of smarter caching so that users only get told if they really care about something.

Luckily if you have static application queries this is actually quite easy!

Service:
```javascript
server.on('/static-search', async (req, res) => {
    const results = await doQuery()
    res.send(results)
})

// Emit an event whenever the client changes (pseduo code based on changelogs)
const specificQueryUpdates = () => {
    let previousResults
    database.table('users').on('change', await () => {
        const results = await doQuery()
        if (!deepEquals(previousResults, results)) {
            deepstream.event.emit('specific-query-changed', results)
        }
        previousResults = results
    })
}
```

Client:
```javascript
// Subscribe to an event on the client
deepstream.event.subscribe('specific-query-changed', doSomethingWithData)
// We still need to get the data initially though, as events are only triggered
// on changes
const results = await makeRequest('/static-search')
doSomethingWithData(results)
```

This means we now have the ability to subscribe to a specific query event and just receive updates. The advantage
of this is that if you have a thousand users connected, the query is still only run once and the result is sent to 
all of them, which makes it much more efficient. The disadvantages so far is the static nature of the event means we can't really do our own custom queries, and that we have to do the event initially which means we have to maintain two different types of APIs. Not cool.

### Dynamic Result Notifications

So how can we let the backend know to setup an endpoint for a custom query, maintain it
during the queries lifetime and then when it's no longer needed discard it? 🤔 There are different solutions, but the one we see most often is:

- Request a query by telling the client to start
- Get updates
- Discard it when your done

In a classical event system this would usually be done as follows (for this example you need to have sticky sessions available in order for the close event to go the same process as the open one)

Service:
```javascript
const searches = new Map()

server.post('/start-search', async (req, res) => {
    // Hash the query so that you can use it as a lookup key
    const searchReference = hashSearch(req.body)
    let search = searches.has(searchReference)

    // If the query already exists, someone already started it, so
    // bump up the usage number and return the last results
    if (searches.has(searchReference)) {
        const search = searches.get(searchReference)
        search.usage = search.usage + 1
        return res.send({
            reference: search.reference,
            data: search.previousResult
        })
    }

    // Setup the cursor 
    const cursor = database.table(req.body.table).on('change', await () => {
        const results = await doQuery(req.body.query)
        if (!deepEquals(search.previousResults, results)) {
            deepstream.event.emit(searchReference, results)
        }
        search.previousResults = results
    })

    // Set the search so new requests won't setup another cursor
    searches.set(searchReference, {
        usage: 1,
        reference: searchReference,
        cursor
    })

    // Do the actual initial search to avoid it having to be done on the 
    // client side
    const results = await doQuery()

    // Send the response
    res.send({ 
        reference: search.reference,
        data: results
    })
})

server.post('/stop-search', async (req, res) => {
    const { reference } = req.body
    const search = searches.get(references)
    if (search) {
        search.usages = search.usages - 1
        if (search.usages === 0) {
            searches.del(reference)
            search.cursor.stop()
        }
        return res.end()
    }
    res.status(400).end()
})
```

Client:
```javascript
// Creating the search
const { reference, data } = makeRequest('/start-search', { query: [['age','gt', '20']], table: 'users' })
deepstream.event.subscribe(reference, doSomethingWithData)
doSomethingWithData(data)

// Ending the search
deepstream.event.unsubscribe(reference)
makeRequest('/stop-search', { reference })
```

Okay so that's alot of code. Probably a good place to stop before writing an actual service. Let us break down the pros and cons of this approach (ignoring potential bugs due to pseudo nature!):

#### Pros

- Minimal amount of cursors open
- Basic lifecycle support means that if the clients always cleaned up after themselves system can go back to 
original state
- We can proxy multiple realtime search queries easily. Not very useful for infinite permutations (like text searches) but if your search is limited or you have built in default searches (like pagination or limits) it would scale well

#### Cons

- If you want to scale you'll need to attach to a third party cache/database (the norm nowadays for distributed/scaling systems)
- You can call start-search / end-search multiple times and it would get the state out of sync
- Most importantly, since its not really tied into the session if your connection drops or you force close your client 
state is incorrect

### Dynamic Result Notifications Using Deepstream

Right so now we are going to rewrite the above code using deepstream APIs. I'll be using `listening`, a powerful API that allows deepstream to notify clients/services whenever a subscription has been added or removed to the system, which removes most of the boiler plate management. I'll also be using RPCs and Records, mainly because it removes us having to use HTTP and automatically saves things in the cache. It's also 95% of the way to explaining how the realtime-search was built.

Service:
```javascript
deepstream.rpc.provide('realtime_search', async (data, response) => {
    const hash = hashSearch(data)
    try {
        await deepstream.record.set(hash, data)
        response.send()
    } catch (e) {
        response.error('Error creating a hash')
    }
})

deepstream.record.listen('realtime_search/list_.*', async (name, response) => {
    const hash = /realtime_search\/list_(.*)/.match(name)[0]
    const data = await deepstream.record.snapshot(hash)
    
    const cursor = database.table(data.table).on('change', await () => {
        const results = await doQuery(data.query)
        const previousResults = await deepstream.record.snapshot(name)
        if (!deepEquals(previousResults, results)) {
            deepstream.record.setData(name, results)
        }
    })

    const results = await doQuery()
    deepstream.record.setData(name, results)

    response.onStop(() => cursor.stop())
    response.accept()
})
```

Client:
```javascript
// Creating the search
const hash = await client.rpc.make('realtime_search', { query: [['age','gt', '20']], table: 'users' })
const record = client.record.getRecord(`realtime_search/list_${hash}`)
record.subscribe((results) => {
    // do something with results
}, true)

// Ending the search
record.discard()
```

Let us see what cons this managed to resolve:

- Scaling

Listening on deepstream uses an active publisher pattern. This means only one service in a cluster can ever
be responsible for a subscription. This means you can scale your services and servers and the load will automatically be
distributed against them.

- Cache/Storage

Using deepstream records we automatically have our data saved to cache. This means by using it we get the benefit
of distributed state out of the box, so if another user subscribes to the same record the micro service won't even need to be told about it

- State

All the connection state and logic is handled by deepstream, which means if your client goes down, deepstream will
clean up all your subscriptions on your behalf. This allows the platform to continue running optimally. So state getting out of sync isn't your concern

*Hint*

The listen pattern can be used for so much more than just this usecase!

### Realtime Search, Finally!

Okay I really hope you made it this far! Let's look at how realtime-search APIs work.

On the server we don't need to actually write any server code, you just have to run the realtime-search service. You can run it via docker [deepstreamio/realtime-search](https://hub.docker.com/r/deepstreamio/realtime-search), but it's also shipped via node under the [@deepstream/realtime-search](https://www.npmjs.com/package/@deepstream/realtime-search) package.

We will be following the [example found in the github repo](https://github.com/deepstreamIO/deepstream.io-realtime-search/tree/master/example). This will use docker compose, which is useful as we need to setup a mongodb replica as well as run deepstream and the realtime-search service for us.

```bash
git clone https://github.com/deepstreamIO/deepstream.io-realtime-search.git
cd deepstream.io-realtime-search/example
docker-compose up
```

Giving us the output:

```bash
11:53:13 AM | Initializing MongoDB Connection
11:53:13 AM | Connected successfully to mongodb database deepstream
11:53:13 AM | Initializing Deepstream connection
11:53:13 AM | Successfully logged in to deepstream
11:53:13 AM | Providing rpc method "realtime_search"
11:53:13 AM | listening for realtime_search/list_.*
11:53:13 AM | realtime search provider ready
```

And then on the client side you would just need to do the same thing we mentioned earlier:

Client:
`embed:server/realtime-search/example/realtime-search-client.js`

And that's it! As you can see getting realtime-results couldn't be easier. 

For a front-end example, more config options and permissions please checkout the [realtime-search guide](/guides/realtime-search/intro/). 

Thanks for reading!