---
title: Node / NPM / Yarn
description: Installing deepstream via NPM and and Node.js
redirectFrom: [/install/nodejs/]
---

![Node.js](nodejs.png)

deepstream can also be installed as an [NPM package](https://www.npmjs.com/package/deepstream.io) and offers a Node.js API to interact with it programmatically.

This can be useful to build custom authentication or permissioning logic. You can view the full Node.js API [here](/docs/server/node-api/).

Install the server via npm

``` bash
npm install @deepstream/server
```

Create a js file, e.g. start.js with the following content

```javascript
const { Deepstream } = require('@deepstream/server')

/*
The server can take
1) a configuration file path
2) null to explicitly use defaults to be overriden by server.set()
3) left empty to load the base configuration from the config file located within the conf directory.
4) pass some options, missing options will be merged with the base configuration
*/
const server = new Deepstream({
  host: 'localhost',
  port: 6020
})

// start the server
server.start()
```

run the file with node
```bash
node start.js
```

![Starting deepstream via node](../deepstream-v4.png)

#### Using the deepstream client in Node.js
The deepstream javascript client can be installed via [NPM](https://www.npmjs.com/package/@deepstream/client) and used in Node.js.

```bash
npm install @deepstream/client
```

```javascript
const deepstream = require('@deepstream/client')
const client = deepstream('localhost:6020')
client.login()
```
