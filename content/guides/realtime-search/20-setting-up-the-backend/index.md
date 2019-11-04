---
title: Setting up the backend
description: Starting the backend services
---

In order to have realtime search running we need:

- deepstream server
- mongodb server
- mongodb replicate (for changefeeds to be enabled)
- realtime-search

Due to the slightly more complex nature of the backend we will let docker-compose manage everything by just using the following commands:

```bash
git clone https://github.com/deepstreamIO/deepstream.io-realtime-search.git
cd deepstream.io-realtime-search/example
docker-compose up
```

Which would result in all the four images being pulled down and run, with deepstream port exposed on 6020

To look a little deeper into it, you'll see that:

- We have a deepstream `config.yml` file for mongodb configuration:

`embed:server/realtime-search/example/conf/config.yml`

- A docker compose file + a mongodb script which sets up deepstream, realtime search, mongodb and a mongodb replica (all using the default images):

`embed:server/realtime-search/example/docker-compose.yml`

Once you run `docker-compose up` that should be it for the backend!

You can also look at all the CLI commands by running

```bash
> docker run deepstreamio/realtime-search mongo --help

Usage: provider mongo [options]

start a mongodb realtime search provider

Options:
  --mongo-url <mongo-url>            Connect to this mongo server
  --mongo-database <mongo-database>  Name of mongo database
  --ds-url <ds-url>                  Connect to this deepstream server
  --logger-type <logger-type>        Log messages with pino or to std
  --log-level <level>                Log messages with this level and above
  --collection-lookup <fileName>     JSON file containing model lookups
  --inspect <url>                    Enable node inspector
  --native-query                     Use native mongodb query syntax
  -h, --help                         output usage information
```