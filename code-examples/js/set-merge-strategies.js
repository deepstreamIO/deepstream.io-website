const customMergeStrategy = (localValue, localVersion, remoteValue, remoteVersion, callback) => {
    callback(error, mergedData)
}

// Set merge strategy globally when initialising the client
const client = deepstream('localhost', { mergeStrategy: deepstream.MERGE_STRATEGIES.LOCAL_WINS })

// Or set merge strategy on a pattern to match multiple records
client.record.setMergeStrategyRegExp('albums/.*', customMergeStrategy)

// Or set merge strategy on a name
client.record.setMergeStrategyByName('name', customMergeStrategy)

// Or set merge strategy on a per record basis (this just proxies to the above, as only one record per name is every created)
rec = ds.record.getRecord('some-record')
rec.setMergeStrategy(customMergeStrategy)