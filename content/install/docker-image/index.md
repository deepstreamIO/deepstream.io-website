---
title: Docker Image
description: Run a deepstream standalone container from an image. This tutorial will also explain how to build the image manually.
---

### What is Docker?

[Docker](https://www.docker.com/) is an open-source project that automates the deployment of applications inside software containers.
Docker provides an additional layer of abstraction and automation of operating-system-level virtualization on Linux.

As actions are performed on a Docker base image, union file system layers are created and documented in such a way that each layer fully describes how to recreate the action. This strategy enables Docker's lightweight images as only layer updates need to be propagated (as opposed to entire VMs).

![Docker Logo](docker.png)

### Why use Docker with deepstream?
Docker provides a lightweight solution to spin up fully functioning deepstream environments. It encapsulates all necessary settings and reduces complexity for large scale microservice deployments.

### How to use Docker with deepstream?
In this tutorial we'll install a standalone Docker image and create a container. The image contains deepstream's source code as well as everything else necessary to run deepstream from source.

If you'd like a bit more than just a single deepstream node, head over to the [Docker Compose tutorial](../docker-compose/), describing how to set up multiple connected database, cache and search containers that act as the message and storage layer for deepstream.

Let's start by installing the image from the DockerHub registry by running this command:

```bash
docker pull deepstreamio/deepstream.io
```

Now create a container from this image and assign the container's name to `deepstream.io`:

```bash
docker create -t -p 6020:6020 -p 6021:6021 \
  --name deepstream.io \
  -v $(pwd)/conf:/usr/local/deepstream/conf \
  -v $(pwd)/var:/usr/local/deepstream/var \
  deepstreamio/deepstream.io
```

Now you can start the container via

```bash
docker start -ia deepstream.io
```

This will start the container in the foreground. You can press <kbd>Ctrl</kbd>+<kbd>c</kbd> but
the container will still be alive. To stop the container you need to run

```bash
docker stop deepstream.io
```

In case you want to start it in the background just omit the `-ia` option.

You can show the logs with this command:

```bash
docker logs -f deepstream.io
```

The `-f` option will keep the process alive and follow output.

If you want to build the Docker image from the Dockerfile and use a docker-compose file instead you can checkout
our [Docker Repository on GitHub](https://github.com/deepstreamIO/docker/tree/master/deepstream.io)
