---
title: HTTP and Log Monitoring
description: Learn how to use monitor deepstream using http or logs
logoImage: http.png
---

Deepstream allows you to gather detailed insights into what the server is actually doing. How detailed is really up to you, since you can aggregate data by topic, action or actually go far enough to log each individual subscription name!

With most users in production we realized the sweet spot is metrics in the following structure:

```json
{
  "clusterSize": 1,
  "stateMetrics": {
    "STATE_REGISTRY": 2,
    "EVENT_LISTEN_PATTERNS": 0,
    "EVENT_PUBLISHED_SUBSCRIPTIONS": 0,
    "RPC_SUBSCRIPTIONS": 1,
    "RECORD_SUBSCRIPTIONS": 1,
    "RECORD_LISTEN_PATTERNS": 0,
    "RECORD_PUBLISHED_SUBSCRIPTIONS": 0,
    "PRESENCE_SUBSCRIPTIONS": 0,
    "LOCK": 1
  },
  "errors": {
    "NO_RPC_PROVIDER": 1
  },
  "recieved": {
    "RPC": {
      "REQUEST": 1,
      "PROVIDE": 1
    },
    "EVENT": {
      "SUBSCRIBE": 1,
      "EMIT": 1
    },
    "RECORD": {
      "SUBSCRIBECREATEANDREAD": 1
    }
  },
  "send": {
    "CONNECTION": {
      "ACCEPT": 1
    },
    "AUTH": {
      "AUTH_SUCCESSFUL": 1
    },
    "RPC": {
      "NO_RPC_PROVIDER": 1,
      "PROVIDE": 1
    },
    "EVENT": {
      "SUBSCRIBE": 1
    },
    "RECORD": {
      "SUBSCRIBECREATEANDREAD": 1,
      "READ_RESPONSE": 1
    }
  },
  "logins": {
    "websocket": {
      "allowed": 1,
      "declined": 0
    }
  }
}
```

This provides us good insight into what the server is actually doing, but doesn't care about the actual subscription names. It's also worth noting that it returns an object with the current state and size of the cluster. This is critical to ensure things are working as expected, essentially making sure all nodes in the cluster are always in the same state.

#### So how can I visualise this?

Usually by using a poll agent like logstash, this takes the json object, transforms it slightly to add some useful meta data and then sends it off to elasticsearch to visualise via Kibana. Keep an eye out for a tutorial  soon!

Deesptream has two prebuilt services for monitoring.

### Http monitoring  

Enables an endpoint to get the metrics. After the endpoint is called, metrics are reseted.
Authentication can be open or setting a `key:value` in the request header.

```yaml
monitoring:
  type: http
  # the endpoint url
  url: /monitoring,
  headerKey: string,
  headerValue: string,
  allowOpenPermissions: false

```

### Log monitoring  

Logs the monitoring metrics to be retrieved by a log transport every `logInterval` milliseconds. After the metrics are logged they are reseted.  

```yaml
monitoring:
  type: log
  # milliseconds
  logInterval: number
  # log key for metrics, defaults to 'DEEPSTREAM_MONITORING'
  monitoringKey: string
```
