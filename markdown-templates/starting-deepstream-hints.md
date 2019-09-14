## A few hints
deepstream's configuration file can be written in both YAML or JSON. deepstream will automatically choose the right parser, based on the file-extension.

Some core configuration options can be overridden via commandline parameters, e.g. `--host`, `--port` or `--disable-auth`. For a full list, just run

```bash
deepstream start --help
```

The configuration file contains relative paths, e.g. for `./permissions.yml` or `users.yml`. If you run the file from another location, make sure to update them. The paths are relative to the directory the main config file resides in.


