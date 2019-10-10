---
title: Docker Image
description: Run a deepstream standalone container from an image. This tutorial will also explain how to build the image manually.
redirectFrom: [/install/docker/]
---

### What is Docker?

[Docker](https://www.docker.com/) is an open-source project that automates the deployment of applications inside software containers.
Docker provides an additional layer of abstraction and automation of operating-system-level virtualization on Linux.

As actions are performed on a Docker base image, union file system layers are created and documented in such a way that each layer fully describes how to recreate the action. This strategy enables Docker's lightweight images as only layer updates need to be propagated (as opposed to entire VMs).

![Docker Logo](docker.png)

### Why use Docker with deepstream?
Docker provides a lightweight solution to spin up fully functioning deepstream environments. It encapsulates all necessary settings and reduces complexity for large scale microservice deployments.

### How to use Docker with deepstream?

To get a deepstream server running quickly you can just do:

```bash
docker run -p 6020:6020 -p 8080:8080 deepstreamio/deepstream.io
```

And that's it! 

If you want to override some of the config or run deepstream in the background keep reading.

If you'd like a bit more than just a single deepstream node, head over to the [Docker Compose tutorial](https://deepstream.io/tutorials/devops/docker-compose/), describing how to set up deepstream with a connected database, cache and search containers that act as the cache and storage layer for deepstream.

Let's start by installing the image from the DockerHub registry by running this command:

```bash
docker pull deepstreamio/deepstream.io
```

Now create a container from this image and assign the container's name to `deepstream.io`:

```bash
docker create -t -p 6020:6020 -p 8080:8080 \
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

