---
title: Command Line Interface
description: The options that can be passed to the deepstream server via the command line
---

deepstream comes with a comprehensive command line interface (CLI) that lets you start or stop the server or override configuration options.

Many of these options can also be set via the configuration file, read [config file documentation](20-configuration.mdx). for a detailed list.

## Usage
If you've [installed](/tutorials/install/linux/) deepstream on linux via a package manager, the `deepstream` command is already on your path. On Mac and Windows, you can access it through the executable, e.g. `./deepstream` or `deepstream.exe`

For the brave souls who've got deepstream via [Github](https://github.com/deepstreamIO/deepstream.io) or [NPM](https://www.npmjs.com/package/deepstream.io) instead, you can find the executable in `bin/deepstream`

Let's start simple:

```bash
deepstream --help
```

will print out all available commands:

```bash
  Usage: deepstream [command]


  Commands:

    start [options]            start a deepstream server
    daemon [options]           start a deepstream daemon that will auto-restart on failures
    service [options] [add|remove|start|stop]  Add, remove, start or stop deepstream as a
                               service to your operating system
    info [options]             print meta information about build and runtime
    hash [options] [password]  Generate a hash from a plain text password using file auth configuration settings

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

You can pass the `--help` option to individual commands as well.


### deepstream start

```bash
deepstream start --help
```

will print all the options you can specify for the deepstream server:

```bash
  Usage: start [options]

  start a deepstream server

  Options:

    -h, --help                         output usage information
    -c, --config [file]                configuration file, parent directory will be used as prefix for other config files
    -l, --lib-dir [directory]          path where to lookup for plugins like connectors and logger
    --server-name <name>               Each server within a cluster needs a unique name
    --host <host>                      host for the HTTP/websocket server
    --port <port>                      port for the HTTP/websocket server
    --disable-auth                     Force deepstream to use "none" auth type
    --disable-permissions              Force deepstream to use "none" permissions
    --log-level <level>                Log messages with this level and above
    --colors [true|false]              Enable or disable logging with colors
```

You can either use the shorthand syntax with one hyphen or the long syntax with two hyphens.

All the options starting from `--server-name` and below will overwrite the values within your config file if. If you want to specify more options, or see the default values provided please look at the [config file documentation](20-configuration.mdx).

#### --config

If you installed it via a linux package manager it will default to _/etc/deepstream_.
Otherwise the paths are relative to your current working directory.

#### --lib-dir

If you installed it via a linux package manager it will default to _/var/lib/deepstream_.
Otherwise the paths are relative to your current working directory.

### deepstream daemon

```bash
deepstream damemon --help
```

This command starts the deepstream server and monitors it for crashes, allowing it to be automatically
restarted on unexpected exits.

It allows all the same commands as `deepstream start`

### deepstream service

```bash
deepstream service --help

  Usage: service [options] [add|remove|start|stop|status]

  Add, remove, start, stop or see the status of deepstream as a service to your operating system

  Options:

    -h, --help             output usage information
    -c, --config [file]    configuration file, parent directory will be used as prefix for other config files
    --service-name <name>  the name to register the service
    --std-out <directory>  the directory for output logs
    --std-err <directory>  the directory for error logs
    --dry-run              outputs the service file to screen
```

#### --config

If you installed it via a linux package manager it will default to _/etc/deepstream_.
Pass the config file you would like the service to use

#### --service-name

Defaults to deepstream
Allows you to create multiple services on the same machine. You would need to ensure that different ports are used
to avoid clashing.

#### --std-out

Specify where you would like your logs to be stored. Default to `/var/log/deepstream`

#### --std-err

Specify where you would like your error logs to be stored. Default to `/var/log/deepstream`

#### --dry-run

See what the config file will emit without writing it to disk. This is useful if you want to avoid running with sudo.

### deepstream info
Displays information, about deepstream's version and system architecture.
If you'd like to raise an issue on Github we'd appreciate if you could paste attach it.

Output example

```json
{
  "deepstreamVersion": "6.1.2",
  "gitRef": "b65e5230b1cedeb102d325d0ad4f568f6e3fd7d8",
  "buildTime": "Sat Apr 23 2022 02:57:49 GMT+0000 (Coordinated Universal Time)",
  "platform": "linux",
  "arch": "x64",
  "nodeVersion": "v14.18.1",
  "libs": [
    "uWebSockets.js:20.5.0"
  ]
}
```

### deepstream hash

This command allows you generate a hash for a plaintext password. Show the usage by appending `--help` to that command:

```bash
  Usage: hash [options] [password]

  Generate a hash from a plaintext password using file auth configuration settings

  Options:

    -h, --help           output usage information
    -c, --config [file]  configuration file containing file auth and hash settings
```
