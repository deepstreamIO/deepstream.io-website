---
title: Docker Compose
description: Run deepstream together with a RethinkDB storage provider, a Redis cache provider and a RethinkDB search provider which allows to subscribe to realtime queries.
draft: true
---

Get more details about Docker in general and about the deepstream standalone Docker in the [Docker&nbsp;image&nbsp;tutorial](../docker/)

### What is Docker Compose?

[Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. With Compose, you use a Compose file to configure your application's services. Then, using a single command, you create and start all the services from your configuration.

### How to use Docker compose with deepstream?

Docker compose consumes a YAML file which contains a description of the containers and how there are linked.
Setup it looks like this:

_docker-docker.yml_:

```yaml
version: '2'
services:
    deepstream:
        image: deepstreamio/deepstream.io
        ports:
            - "6020:6020"
            - "6030:8080"
        volumes:
            - ./conf:/conf
        depends_on:
            - redis
            - rethinkdb
    deepstream-search-provider:
        image: deepstreamio/provider-search-rethinkdb
        environment:
            - DEEPSTREAM_HOST=deepstream
            - DEEPSTREAM_PORT=6020
            - RETHINKDB_HOST=rethinkdb
        depends_on:
            - deepstream
    redis:
        image: redis:alpine
        ports:
            - "6379:6379"
    rethinkdb:
        image: rethinkdb
        ports:
            - "28015:28015"
            - "8080:8080"
        volumes:
            - ./rethinkdb_data:/data/rethinkdb_data
```

The compose file defines four services:

- __deepstream__ - the deepstream server
- __deepstream-search-provider__ - a deepstream client which handles the realtime queries of RethinkDB
- __redis__ - Redis server which is used as both cache and message layer for deepstream
- __rethinkdb__ - RethinkDB as the storage layer for deepstream

The services are accessible to each other via the service name as the hostname. We will need this value in
the deepstream configuration later.

Explanation of properties of a service:
  - __image__ URL of the image from the Docker Hub registry
  - __ports__ port forwarding of the exposed ports on the container to the port on the host machine
  - __volumes__ mount and share the directory from the host machine to the container
  - __depends_on__ defines a dependency which affects the starting order of the containers
  - __environment__ set environment variables in the container


By default deepstream will not use any connectors for the storage, cache and message layer.
This means you need to provide a configuration file and set the options for the connectors.
The easiest way to do this is by copying all the files from the [conf/](https://github.com/deepstreamIO/deepstream.io/tree/master/conf) directory into your _conf_ directory next to the compose file.

Then change the plugins section to:

```yaml
cache:
    name: redis
    options:
        host: redis
        port: 6379

storage:
    name: rethinkdb
    options:
        host: rethinkdb
        port: 28015
        splitChar: /
```

Now you can run all containers with just one command:

```bash
docker-compose up
```

If you want to build the deepstream images from the Dockerfiles instead you can checkout
our [Docker Repository on GitHub](https://github.com/deepstreamIO/docker)
