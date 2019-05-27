---
title: Errors
description: The API docs for deepstream's runtime errors
draft: true
---

Errors are used throughout deepstream. They can be accessed via the module.

```javascript
const deepstream = require('deepstream.io-client-js')
deepstream.CONSTANTS.EVENTS
```


```
{{#table}}
meta:
  options:
    header:
      - name
      - description
      - server
      - client
list:
-
  name: CONNECTION_ERROR
  description: The websocket connection has encountered an error.
  server: ''
  client: ✔

-
  name: UNSOLICITED_MESSAGE
  description: A message was received that the client didn't expect, e.g. an update for a record that the client isn't subscribed to. This doesn't necessarily have to be an error, but can also be the result of messages crossing on the wire, e.g. when an outgoing record discard and an incoming message overlap.
  server: ''
  client: ✔

-
  name: MESSAGE_PARSE_ERROR
  description: The client has received a syntactically incorrect message.
  server: ✔
  client: ✔

-
  name: IS_CLOSED
  description: Emitted when the client tries to authenticate against an already closed connection.
  server: ''
  client: ✔

-
  name: VERSION_EXISTS
  description: The client has tried to update a record to a version that the server already has. This might happen if multiple clients try to update the same record at the same time. This error will also be emitted by the affected Record. To mitigate this error, configure a [merge strategy](/tutorials/core/handling-data-conflicts/)
  server: ✔
  client: ✔

-
  name: NOT_AUTHENTICATED
  description: Emitted if an operation is attempted before the client is authenticated (before <code>login()</code> has been called and a response was received).
  server: ''
  client: ✔

-
  name: ACK_TIMEOUT
  description: The acknowledgement response for a record subscription, event subscription or rpc call hasn't been received in time. This error is also emitted by the object that encountered it, e.g. the Record or Rpc.
  server: ✔
  client: ✔

-
  name: LISTENER_EXISTS
  description: Emitted when <code>client.record.listen( pattern, callback )</code> is called more than once for the same pattern.
  server: ''
  client: ✔

-
  name: NOT_LISTENING
  description: Emitted when <code>client.record.unlisten( pattern )</code> is called for a pattern that no listener exists for.
  server: ''
  client: ✔

-
  name: TOO_MANY_AUTH_ATTEMPTS
  description: Emitted when the client has made more invalid authentication attempts than the server accepts. This can be configured as maxAuthAttempts on the server.
  client: ✔
  server: ✔
{{/table}}
```
