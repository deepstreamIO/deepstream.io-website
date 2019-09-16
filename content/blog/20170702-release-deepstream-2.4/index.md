---
title: "Release: Deepstream 2.4"
blogImage: ./2.4-deepstream.png
description: Announcing the 2.4 release of deepstream.io
---

Announcing the release of [deepstream.io 2.4](https://github.com/deepstreamIO/deepstream.io/releases/tag/v2.4.0), which now supports running deepstream as a daemon and registering itself as a service via init.d or systemd.

![deepstream.io 2.4](2.4-deepstream-elton.jpg)

## Registering as a linux service

If you are running any linux distro chances are you support either init.d ([AWS](/open-source/#install/)/[CentOS](/open-source/#install/)) or systemd ([Ubuntu](/open-source/#install/)/[debian](/open-source/#install/)). Using the new service installer means downloading deepstream and getting it to run as a service and auto-restart to avoid downtime is as easy as

```bash
# When using YUM
sudo wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
sudo yum install -y deepstream.io
# Install as a init.d service
sudo deepstream service add
# Start the service
sudo deepstream service start
```

And that's it! You now have a service running locally that can provide realtime goodness out of the box! To view all of the CLI options look [here](../../docs/server/command-line-interface/) and checkout the [tutorial](../../tutorials/core/deepstream-service/) for more info!

## Running a daemon

For those running servers on windows or mac, although we currently don't support as a native service on those platforms you can still run the daemon to monitor and auto-restart deepstream if necessary, while still supporting al the normal start options

```bash
deepstream daemon --help

Usage: daemon [options]

start a daemon for deepstream server

Options:

  -h, --help                 output usage information
  -c, --config [file]        configuration file, parent directory will be used as prefix for other config files
  -l, --lib-dir [directory]  path where to lookup for plugins like connectors and logger
  --server-name <name>       Each server within a cluster needs a unique name
  --host <host>              host for the HTTP/websocket server
  --port <port>              port for the HTTP/websocket server
  --disable-auth             Force deepstream to use "none" auth type
  --disable-permissions      Force deepstream to use "none" permissions
  --log-level <level>        Log messages with this level and above
```

## Installing via brew cask

Last, but certainly not least, we now publish deepstream via the awesome [homebrew](https://brew.sh/). This means [installing deepstream on osx](/open-source/#install/) is as simple as

```bash
brew cask install deepstream
```

And install plugins from anywhere

```bash
deepstream install msg redis
=> deepstream.io-msg-redis v1.0.4 was installed to /usr/local/lib/deepstream
```

So let brew deal with installing and upgrading, so that you don't have to!
