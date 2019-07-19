---
title: Installing on Linux
description: Learn how to install deepstream on Linux
---

<a class="install-link" data-os="linux"></a>

Download the server from the link above and unzip it.

![Linux directory](linux-directory.png)

## Starting deepstream
You can start the server by simply running it on the command line

```bash
./deepstream
```

Learn more about deepstream's [command line interface](/docs/server/command-line-interface/) and its [configuration file](/docs/server/configuration/).

## Install as a service

You can install deepstream as a service, which automatically restarts it on failure and all those other linux service
goodies. To do so just run:

```bash
./deepstream service add -c /path/to/config -l /path/to/logs
```

After installing, you can start and stop deepstream simply by doing:

```bash
deepstream service start
```

![Starting deepstream on linux](../linux-start.png)

