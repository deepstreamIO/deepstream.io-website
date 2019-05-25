---
title: Handling Data Conflicts
description: This tutorial explains how to handle merge conflicts in deepstream
tags: [merge, deepstream, operational transfers]
---

Merge conflicts can occur when two or more clients write to the same record at the exact same time.

## How does deepstream keep track of data consistency?
deepstream uses incrementing version numbers to make sure changes to records happen in sequence and no intermediary update gets lost. Each message created as a result of a `set()` call contains the version number that the client expects to set the record to.

The server will ensure that the version of an incoming update is exactly one higher than the current version. If it is, the update is applied and propagated to all other subscribed clients. If it's not though, one of two things will happen:

#### If the incoming version is the same as the existing version
If the version of an incoming update is the **same** as the current version,
deepstream assumes a write conflict. It will keep the current version and send a `VERSION_EXISTS` error to the client that tried to update the record to the existing version. On the client, this will invoke a `MERGE_STRATEGY` function. More about merge strategies below.

#### If the incoming version is lower than or more than 1 higher than the current version
If versions have gotten out of sync, the server will attempt a reconciliation.

## Handling merge conflicts
Merge conflicts are handled by `MERGE_STRATEGY` functions. These are exposed by the `deepstream` object and can be set globally when the client is initialized, on a pattern or on a per record basis.

```javascript
// Set merge strategy globally when initialising the client
client = deepstream('localhost', { mergeStrategy: deepstream.MERGE_STRATEGIES.LOCAL_WINS })

// Set merge strategy on a pattern when initialising the client
client = deepstream('localhost', { mergeStrategy: deepstream.MERGE_STRATEGIES.LOCAL_WINS })
client.record.setMergeStrategyRegExp('name', (localValue, localVersion, remoteValue, remoteVersion, callback) => {
    callback(error, mergedData)
})

// Set merge strategy on a per record basis
rec = ds.record.getRecord('some-record')
rec.setMergeStrategy(deepstream.MERGE_STRATEGIES.REMOTE_WINS)
```

By default, `LOCAL_WINS` and `REMOTE_WINS` are available. It is also possible to implement custom merge strategies, e.g.

```javascript
// Accept remote title, but keep local content
rec.setMergeStrategy(( record, remoteData, remoteVersion, callback ) => {
    callback( null, {
        title: remoteData.title,
        content: record.get( 'content' )
    });
});
```

## Avoiding merge conflicts
The more granular you structure your records, the rarer merge conflicts will be. Generally, deepstream is better at coping with a large number of small records than with a few very large ones.
Especially when it comes to records with high upstream and downstream rates, e.g. am item on an auction site with quickly updating prices, it might make sense to make the upstream (e.g. the bids a client submits) a separate record or model them as events or RPCs
