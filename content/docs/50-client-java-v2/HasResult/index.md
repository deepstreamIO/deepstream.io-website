---
title: Class HasResult
description: A class representing the outcome of a record Has
category: class
navLabel: HasResult
body_class: dark
---

HasResult provides the ability for clients to determine whether or not a record exists via <a href="./RecordHandler#has(name)"><code>client.record.has(name)</code></a> .

## Methods

### boolean getResult()

Returns a boolean reflecting whether or not the record exists.

### DeepstreamError getData()

Returns an error if there was one while checking for existence of the record..

### boolean hasError()

Returns a boolean indicating if there was an error checking the record exists.
