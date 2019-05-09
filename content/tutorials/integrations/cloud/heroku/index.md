---
title: Heroku
description: Learn how to deploy a deepstream cluster with MongoDB and Redis on Heroku
tags: [PaaS, IaaS, Heroku, deepstream, realtime, MongoDB, Redis]
---

In this tutorial we'll setup a deepstream server on Heroku, backed by
a MongoDB storage layer and a Redis cache layer.

![Heroku deepstream](heroku-deepstream.png)

## Starting from scratch
Let's start from scratch with an empty directory:

```shell
mkdir ds-demo-Heroku
cd ds-demo-Heroku
```

At the time of writing, a deepstream Heroku addon/build-pack is on the agenda
but not quite there yet, so let's start with a Node.js based one

To create a _package.json_ file you can just run this command:

```shell
npm init
```

If you don't have Node.js (and npm) installed you can also use the package.json listed at the end of this article.

Now the deepstream server is ready to be installed via

```shell
npm install deepstream --save
```

Heroku provides different versions of Node.js which can be specified in the package.json. So let's add a property to the _package.json_ to define that it needs to use the latest stable Node.js version:

```javascript
  //...
  "engines": {
    "node": "4.4.7"
  },
  //...
```

Heroku applications also need a [Procfile](https://devcenter.Heroku.com/articles/procfile) in the root directory which contains the application type and command. Since deepstream is a server it needs to be defined as a `web` type.

```
web: npm start
```

Now let's create the npm start script in the _package.json_:

```javascript
  //..
  "scripts": {
    "start": "deepstream start"
  },
  //..
```

On Heroku you can't expose a port directly. Instead Heroku will set an environment variable called `PORT` which you'll need to use for your server. This means you need to overwrite the default deepstream port. You can do this in the deepstream configuration file.

Let's copy the default configuration file to our project directory:

```shell
cp -r node_modules/deepstream.io/conf .
```

Now you need to change the port in the _conf/config.yml_:

```yaml
port: ${PORT}
```

__NOTE__

If you want to access a Heroku app from an external network you need to use port **80**, because all connections will be automatically redirected to the internal port of the environment variable.

## Create a git repository

Deployment with Heroku is based on git repositories. So you need to initialize
the current directory as a git repository via `git init`.

Don't forget to add your *node_modules* folder to your _.gitignore_ file by adding this line:

```
node_modules
```

Next up we'll commit all other files in the current directory:

```shell
git commit -a -m "init commit"
```

For more details on how to use git you can follow this [beginner's guide](https://rogerdudler.github.io/git-guide)

## Creating and deploying a Heroku app

If you're not logged in already with the Heroku CLI then download
the [Heroku toolbelt](https://toolbelt.Heroku.com/)
and login with your Heroku credentials via `heroku login`.

For the next step you will create the Heroku app. You should consider to choose a [region](https://devcenter.Heroku.com/articles/regions) in order to avoid unnecessary bigger network delays as most of the connection will come from the United States which is the default value (USA).

This command creates an app with the name **deepstream-test** in Europe:


```shell
Heroku apps:create deepstream-test --region eu
```

A git remote (Heroku) is also created and associated with your local git repository. You can see it in your _.git/config_ file.

Now you can push the code (from our local repository) to the remote repository at Heroku:

```shell
git push heroku master
```

After ths process is finished we can check the logs on Heroku via:

```
heroku logs -t
```

You might notice that the deepstream logo is broken in the logs. This
is because the stdout is streamed asynchronously, so just ignore it ;)

[![asciicast](https://asciinema.org/a/1vu68mmlip64a408i7mxzryis.png)](https://asciinema.org/a/1vu68mmlip64a408i7mxzryis)

## Connecting to the deepstream server

To connect the the server you can open this [codepen example](http://codepen.io/timaschew/pen/RRrzjg?editors=1010) and change the `DEEPSTREAM_HOST` to your own host.

You can play around with the codepen and uncomment the `record.set` line and change its value. If you comment out that line again you should still get the same output.

By default, deepstream only stores data in memory, so if your [dyno goes into standby](https://devcenter.Heroku.com/articles/free-dyno-hours) and wakes up again the record's data will be lost. To avoid this you'll need to add a "storage connector".

## Adding a deepstream storage connector

Heroku provides [addons](https://elements.Heroku.com/addons) for databases, logging and more. Choose a free plan of [mongolab](https://elements.Heroku.com/addons/mongolab) which provides a MongoDB instance in the cloud. The Heroku CLI provides a way do to the whole setup for you, so you don't need to create an account nor do you need to care about the credentials, which are automatically added to your Heroku app via an environment variable
(`MONGODB_URI`).

```shell
heroku addons:create mongolab:sandbox
```

You need to verify your account on Heroku to use this addon. Otherwise you can
setup the account on mongolab by yourself and set the `MONGODB_URI` environment variable to your Heroku app.

Alright, time to install the MongoDB connector for deepstream:

```shell
npm install deepstream.io-storage-mongodb --save
```

and add a storage connector configuration snippet to the _conf/config.yml_:

```yaml
plugins:
  storage:
    name: mongodb
    options:
      connectionString: ${MONGODB_URI}
      database: someDb
      defaultTable: someTable
      splitChar: "/"
```

That's it, the only thing left is to add the changes to master branch via

```shell
git commit -a -m "add mongodb connector"
git push Heroku master
```

Now all the record data will be persisted (if you add and change them via the codepen example), even if you stop or restart your Heroku app.

## Add a deepstream cache connector

Databases are sometimes too slow for realtime requirements, as the focus of a database is to store data. So if you want to speed up your app you can add a cache layer.
We're going to use another addon on Heroku: [rediscloud service](https://elements.Heroku.com/addons/rediscloud) provides a free redis server for your Heroku apps. The credentials will be saved in the `REDISCLOUD_URL` environment variable:

```shell
Heroku addons:create rediscloud:30
```

Install the Redis cache connector for deepstream:

```shell
npm install deepstream.io-cache-redis --save
```

To enable Redis with deepstream you need the redis configuration to the plugins
object in the _conf/config.yml_:

```yaml
plugins:
  storage:
    name: mongodb
    options:
      connectionString: ${MONGODB_URI}
      database: someDb
      defaultTable: someTable
      splitChar: "/"
  cache:
    name: redis
    options: ${REDISCLOUD_URL}?dropBufferSupport=true
```

In your logs you should see these two lines which indicates that the storage and cache layer are enabled:

```
INFO | cache ready
INFO | storage ready
```

## Resources

Here is the final _package.json_ in case you couldn't or don't want to use npm
on your local machine:

```json
{
  "name": "ds-demo-Heroku",
  "version": "1.0.0",
  "description": "Deploy a deepstream.io server on Heroku",
  "main": "index.js",
  "scripts": {
    "start": "deepstream start"
  },
  "engines": {
    "node": "4.4.7"
  },
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "deepstream.io": "github:deepstreamio/deepstream.io",
    "deepstream.io-cache-redis": "^1.0.0",
    "deepstream.io-storage-mongodb": "^1.0.1"
  }
}
```

You can also checkout the final sourcecode on GitHub: https://github.com/deepstreamIO/ds-demo-Heroku
