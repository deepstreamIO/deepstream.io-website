---
title: NPM
description: Installing deepstream via NPM and and Node.js
---

![Node.js](nodejs.png)

deepstream can also be installed as an [NPM package](https://www.npmjs.com/package/deepstream.io) and offers a Node.js API to interact with it programmatically.

This can be useful to build custom authentication or permissioning logic or if you want to use the server [on top of a HTTP server like Express](/tutorials/integrations/other-http/). You can view the full Node.js API [here](/docs/server/node-api/).

Install the server via npm

``` bash
npm install deepstream.io
```

Create a js file, e.g. start.js with the following content

```javascript
const DeepstreamServer = require('deepstream.io')
const C = DeepstreamServer.constants
/*
The server can take
1) a configuration file path
2) null to explicitly use defaults to be overriden by server.set()
3) left empty to load the base configuration from the config file located within the conf directory.
4) pass some options, missing options will be merged with the base configuration
*/
const server = new DeepstreamServer({
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

#### Using the deepstream client in Node.js
The deepstream javascript client can be installed via [NPM](https://www.npmjs.com/package/deepstream.io-client-js) and used in Node.js.

```bash
npm install deepstream.io-client-js
```

```javascript
const deepstream = require('deepstream.io-client-js')
const client = deepstream('localhost:6020').login()
```
