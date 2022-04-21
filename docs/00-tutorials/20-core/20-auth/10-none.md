---
title: Auth None
---

To disable authentication against a deepstream server altogether, either set the `auth` type to `none` in the server's [configuration file](../../../docs/server/configuration/).

```yaml
#Authentication
auth:
  type: none
```

Or use the `--disable-auth` command line argument.

```bash
./deepstream start --disable-auth
```

The deepstream startup log should confirm that authentication is disabled.

:::note
Even with authentication type `none`, users can still provide an (unverified) username by sending `{username: 'johndoe'}` at login.
:::

```javascript
client = new DeepstreamClient('localhost:6020')
client.login({ username: 'johndoe' })
```

If no username is provided, deepstream will default to `OPEN`.
