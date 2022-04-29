---
title: Winston Logger
---

### Winston

Winston logger comes as a plugin bundled with the binary. When using deepstream as a nodejs package it must be installed from NPM `npm i @deepstream/logger-winston`


```yaml
 name: winston
  options:
    transports:
      # specify a list of transports (console, file, time)
      -
        type: console
        options:
          level: verbose
          colorize: true
      -
        type: file
        level: debug
        options:
          filename: 'logs.json'
      -
        type: time
        level: warn
        options:
          filename: time-rotated-logfile
          datePattern: .yyyy-MM-dd-HH-mm
```


See [server configuration](/10-docs/10-server/20-configuration.mdx#loglevel) for log levels