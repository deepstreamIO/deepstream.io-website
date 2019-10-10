Before we start anything we will first get deepstream running locally on our machine. Deepstream doesn't require any custom code or logic to reside on the server in order to provide the functionality we cover in all the guides here, and that isn't purely out of laziness! The goal when using deepstream (or any microservice architecture) is to be able to deploy effectively with no downtime and scale individual services independently. Tying logic into the server defeats that purpose, makes it harder to test and is a pattern we will try to avoid when possible.

### Running from the binary

The quickest way to run deepstream (if you don't have docker installed) is to download the latest release from github [here](https://github.com/deepstreamIO/deepstream.io/releases), unzip it and run it via your command line terminal or double clicking on it in windows.

```bash
# On mac / linux machines
./deepstream

# On windows
./deepstream.exe
```

And that's it, as long as the output says that it started correctly your ready to start developing against it.

```bash
INFO | Deepstream started
```

### Running via docker

Running any service via docker is my personal favorite way, since upgrading, tags, running with different services and deploying it on your production or CI machines are all the same. Provided you have docker installed you can run deepstream doing the following:

```bash
docker run \
    -p 6020:6020 \
    deepstreamio/deepstream.io:latest-alpine
```

Keep in mind we'll also need to be modifying the config file. The most effective way of doing this is by mounting a directory with deepstream config when running the docker image

```bash
docker run \
    -p 6020:6020 \
    -v /conf:/etc/conf/deepstream
    deepstreamio/deepstream.io:latest-alpine
```

### Running via node

For those who want to embed deepstream into a larger process, for example sharing your HTTP service across your own application logic (useful for running express and deepstream on the same port), using custom plugins, bundling it into your own binary (for those who are a bit more hardcore) or any other reason this is the way to go. Deepstream is written in Typescript which makes developing against it a breeze.

To run deepstream via node you need to do the following:

1. Install via node / yarn

```bash
npm install deepstream.io --save-production
```

2. Import it into your codebase

```js
import { Deepstream } from 'deepstream.io'
```

3. Configure it, either by

..1. Using a config.yml file (living in a directory called conf)

```js
const deepstream = new Deepstream()
```

..2. Using the default config that gets shipped with deepstream (for quick start setups):

```js
const deepstream = new Deepstream(null)
```

..3. Using custom config

```js
const deepstream = new Deepstream({
    auth: [{
        path: './src/authentication/custom-authentication-plugin.js'.
        options: {
        }
    }]
})
```

..4. Or for those who really know what they doing, overriding services entirely:

```js
const deepstream = new Deepstream(null)
deepstream.set('auth', new CustomAuthenticationPlugin())
deepstream.start()
```