---
title: Class SnapshotResult
description: A class representing the outcome of a Snapshot
---

SnapshotResult provides access to the data of a record or any errors while retrieving it via <a href="./RecordHandler#snapshot(name)"><code>client.record.snapshot(name)</code></a> .

## Methods

### JsonElement getData()

Returns the record data.

### DeepstreamError getData()

Returns any errors while retrieving the record data.

### boolean hasError()

Returns a boolean indicating whether or not there was an error retrieving the record data.
