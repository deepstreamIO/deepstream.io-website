---
title: Starting the server
description: Find out how to start the deepstream server
---

deepstream comes with a configuration file found at _conf/config.yml_ on windows/mac or in '/etc/deepstream/config.yml on Linux'. You can either edit it directly or create a copy and pass it to deepstream using the `-c` flag, e.g.

```bash
deepstream start -c ~/path/to/config.yml
```

The file is fully documented and there are a lot of configuration options that you can change or add. If you want to change port or host details, add plugins or options for permissions and authentication, the configuration file is the place to be.

## A few hints
deepstream's configuration file can be written in both YAML or JSON. deepstream will automatically choose the right parser, based on the file-extension.

Some core configuration options can be overridden via commandline parameters, e.g. `--host`, `--port` or `--disable-auth`. For a full list, just run

```bash
deepstream start --help
```

The configuration file contains relative paths, e.g. for `./permissions.yml` or `users.yml`. If you run the file from another location, make sure to update them.
