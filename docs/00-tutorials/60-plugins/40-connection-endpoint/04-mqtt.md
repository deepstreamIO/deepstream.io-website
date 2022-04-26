---
title: MQTT
---

### How to configure:

```yaml
connectionEndpoints:
   - type: mqtt
    options:
        # port for the mqtt server
        port: 1883
        # host for the mqtt server
        host: 0.0.0.0
        # timeout for idle devices
        idleTimeout: 60000
```