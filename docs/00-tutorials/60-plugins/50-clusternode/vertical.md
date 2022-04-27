---
title: Vertical Cluster Connector
---

#### How to use vertical clustering with deepstream?

Since version 6 deepstream comes with the vertical cluster plugin that can be enabled via the config option. It's responsible for allowing deepstream nodes to communicate with each other while running on different cores in the same machine. This way, all the machine cores can be used to run a deepstream cluster: no network latency!


```yaml
clusterNode:
  name: vertical
```

In order to run multiple deepstream servers on each core you can use the following example code:

```js
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const process = require('process')
const { Deepstream } = require('@deepstream/server')
const server = new Deepstream({
  clusterNode: { name: 'vertical' }
})

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server

  server.start()
  console.log(`Worker ${process.pid} started`)
}
```
