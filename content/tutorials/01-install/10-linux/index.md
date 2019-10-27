---
title: Installing on Linux
description: Learn how to install deepstream on Linux
redirectFrom: [/install/linux/,/tutorials/core/server/getting-started-config/]
---

Download the latest server artifact [deepstream.io-linux-VERSION.tar.gz](https://github.com/deepstreamIO/deepstream.io/releases) and unzip it.

## Starting deepstream
You can start the server by simply running it on the command line

```bash
./deepstream
```

Learn more about deepstream's [command line interface](/docs/server/command-line-interface/) and its [configuration file](/docs/server/configuration/).

`markdown:starting-deepstream-hints.md`

## Install as a service

As of 2.4, deepstream comes with ability to automatically setup and run as a service on machines supporting init.d or systemd.

Installing the service is as simple as

```bash
sudo deepstream service add
```

Which then allows you to start it using the normal service command

```bash
sudo service deepstream start
```

or through an alias directly via deepstream

```bash
sudo deepstream service start
```

For those looking to register multiple services (to run multiple deepstreams on one machine) you can do so by specifying the name and providing unique config files

```bash
sudo deepstream service add --service-name deepstream-6020 -c ~/path1/to/config
sudo deepstream service add --service-name deepstream-6030 -c ~/path2/to/config
```


## Avoiding Sudo

If you want to make sure the service configuration is set correctly, or if you feel uncomfortable running something under sudo, you can run `add` with the `--dry-run` option to print the service script out for inspection and manual installation.

```bash
deepstream service add --dry-run
```
