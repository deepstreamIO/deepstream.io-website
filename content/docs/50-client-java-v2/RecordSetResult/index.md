---
title: Class RecordSetResult
description: A class representing the outcome of a Record write
category: class
navLabel: RecordSetResult
body_class: dark
---

RecordSetResult provides access to the success or failure of a record write called via <a href="./Record#setWithAck(data)"><code>record.setWithAck(data)</code></a> or <a href="./Record#setWithAck(path,data)"><code>record.setWithAck(path,data)</code></a>.

## Methods

### String getResult()

An error string if there were any problems writing to the record or null.
