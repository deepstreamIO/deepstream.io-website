---
title: Standard Logger
---


### Default logger

Logs to the operating system's standard-out and standard-error streams. Consoles / Terminals as well as most log-managers and logging systems consume messages from these streams.

```yaml

logger:
  type: default
  options:
    colors: true
```

See [server configuration](/10-docs/10-server/20-configuration.mdx#loglevel) for log levels