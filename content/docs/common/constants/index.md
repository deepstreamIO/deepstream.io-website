---
title: Constants
description: A list of all constants deepstream uses
draft: true
---

Constants are used throughout deepstream. They can be accessed via the module.

```javascript
// client
const {
  CONSTANTS
} = require('@deepstream/client');

// server
const {
  constants
} = require('@deepstream/server');
```

## Log Level

```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- LOG_LEVEL.DEBUG | 0 | ✔ |  |
- LOG_LEVEL.INFO | 1 | ✔ |  |
- LOG_LEVEL.WARN | 2 | ✔ |  |
- LOG_LEVEL.ERROR | 3 | ✔ |  |
- LOG_LEVEL.OFF | 100 | ✔ |  |
{{/table}}
```

## Server State
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- STATES.STARTING | starting | ✔ |  |
- STATES.INITIALIZED | initialized | ✔ |  |
- STATES.IS_RUNNING | is-running | ✔ |  |
- STATES.CLOSING | closing | ✔ |  |
- STATES.CLOSED | closed | ✔ |  |
{{/table}}
```

## Connection State
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- CONNECTION_STATE.CLOSED | CLOSED |  | ✔ |
- CONNECTION_STATE.AWAITING_CONNECTION | AWAITING_CONNECTION |  | ✔ |
- CONNECTION_STATE.CHALLENGING | CHALLENGING |  | ✔ |
- CONNECTION_STATE.AWAITING_AUTHENTICATION | AWAITING_AUTHENTICATION |  | ✔ |
- CONNECTION_STATE.AUTHENTICATING | AUTHENTICATING |  | ✔ |
- CONNECTION_STATE.OPEN | OPEN |  | ✔ |
- CONNECTION_STATE.ERROR | ERROR |  | ✔ |
- CONNECTION_STATE.RECONNECTING | RECONNECTING |  | ✔ |
{{/table}}
```

## Event
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- EVENT.TRIGGER_EVENT | TRIGGER_EVENT | ✔ |  |
- EVENT.INCOMING_CONNECTION | INCOMING_CONNECTION | ✔ |  |
- EVENT.INFO | INFO | ✔ |  |
- EVENT.SUBSCRIBE | SUBSCRIBE | ✔ |  |
- EVENT.UNSUBSCRIBE | UNSUBSCRIBE | ✔ |  |
- EVENT.RECORD_DELETION | RECORD_DELETION | ✔ |  |
- EVENT.INVALID_AUTH_MSG | INVALID_AUTH_MSG | ✔ |  |
- EVENT.INVALID_AUTH_DATA | INVALID_AUTH_DATA | ✔ |  |
- EVENT.AUTH_ATTEMPT | AUTH_ATTEMPT | ✔ |  |
- EVENT.AUTH_ERROR | AUTH_ERROR | ✔ |  |
- EVENT.TOO_MANY_AUTH_ATTEMPTS | TOO_MANY_AUTH_ATTEMPTS | ✔ | ✔ |
- EVENT.AUTH_SUCCESSFUL | AUTH_SUCCESSFUL | ✔ |  |
- EVENT.NOT_AUTHENTICATED | NOT_AUTHENTICATED |  | ✔ |
- EVENT.CONNECTION_ERROR | CONNECTION_ERROR | ✔ | ✔ |
- EVENT.MESSAGE_PERMISSION_ERROR | MESSAGE_PERMISSION_ERROR | ✔ | ✔ |
- EVENT.MESSAGE_PARSE_ERROR | MESSAGE_PARSE_ERROR | ✔ | ✔ |
- EVENT.MAXIMUM_MESSAGE_SIZE_EXCEEDED | MAXIMUM_MESSAGE_SIZE_EXCEEDED | ✔ |  |
- EVENT.MESSAGE_DENIED | MESSAGE_DENIED | ✔ | ✔ |
- EVENT.INVALID_MESSAGE_DATA | INVALID_MESSAGE_DATA | ✔ |  |
- EVENT.UNKNOWN_TOPIC | UNKNOWN_TOPIC | ✔ |  |
- EVENT.UNKNOWN_ACTION | UNKNOWN_ACTION | ✔ |  |
- EVENT.MULTIPLE_SUBSCRIPTIONS | MULTIPLE_SUBSCRIPTIONS | ✔ |  |
- EVENT.NOT_SUBSCRIBED | NOT_SUBSCRIBED | ✔ |  |
- EVENT.LISTENER_EXISTS | LISTENER_EXISTS |  | ✔
- EVENT.NOT_LISTENING | NOT_LISTENING |  | ✔
- EVENT.IS_CLOSED | IS_CLOSED |  | ✔
- EVENT.ACK_TIMEOUT | ACK_TIMEOUT | ✔ | ✔ |
- EVENT.RESPONSE_TIMEOUT | RESPONSE_TIMEOUT | ✔ | ✔ |
- EVENT.DELETE_TIMEOUT | DELETE_TIMEOUT |  | ✔ |
- EVENT.UNSOLICITED_MESSAGE | UNSOLICITED_MESSAGE |  | ✔ |
- EVENT.MULTIPLE_ACK | MULTIPLE_ACK | ✔ |  |
- EVENT.MULTIPLE_RESPONSE | MULTIPLE_RESPONSE | ✔ |  |
- EVENT.NO_RPC_PROVIDER | NO_RPC_PROVIDER | ✔ |  |
- EVENT.RECORD_LOAD_ERROR | RECORD_LOAD_ERROR | ✔ |  |
- EVENT.RECORD_CREATE_ERROR | RECORD_CREATE_ERROR | ✔ |  |
- EVENT.RECORD_UPDATE_ERROR | RECORD_UPDATE_ERROR | ✔ |  |
- EVENT.RECORD_DELETE_ERROR | RECORD_DELETE_ERROR | ✔ |  |
- EVENT.RECORD_SNAPSHOT_ERROR | RECORD_SNAPSHOT_ERROR | ✔ |  |
- EVENT.RECORD_NOT_FOUND | RECORD_NOT_FOUND | ✔ | ✔ |
- EVENT.CACHE_RETRIEVAL_TIMEOUT | CACHE_RETRIEVAL_TIMEOUT | ✔ |  |
- EVENT.STORAGE_RETRIEVAL_TIMEOUT | STORAGE_RETRIEVAL_TIMEOUT | ✔ |  |
- EVENT.CLOSED_SOCKET_INTERACTION | CLOSED_SOCKET_INTERACTION | ✔ |  |
- EVENT.CLIENT_DISCONNECTED | CLIENT_DISCONNECTED | ✔ |  |
- EVENT.INVALID_MESSAGE | INVALID_MESSAGE | ✔ |  |
- EVENT.VERSION_EXISTS | VERSION_EXISTS | ✔ | ✔ |
- EVENT.INVALID_VERSION | INVALID_VERSION | ✔ |  |
- EVENT.PLUGIN_ERROR | PLUGIN_ERROR | ✔ |  |
- EVENT.UNKNOWN_CALLEE | UNKNOWN_CALLEE | ✔ | ✔ |
{{/table}}
```

## Topic
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- TOPIC.CONNECTION | C | ✔ | ✔ |
- TOPIC.AUTH | A | ✔ | ✔ |
- TOPIC.ERROR | X | ✔ | ✔ |
- TOPIC.EVENT | E | ✔ | ✔ |
- TOPIC.RECORD | R | ✔ | ✔ |
- TOPIC.RPC | P | ✔ | ✔ |
- TOPIC.PRIVATE | PRIVATE/ | ✔ | ✔ |
{{/table}}
```

## Actions
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- ACTIONS.PING | PI | ✔ |   |
- ACTIONS.PONG | PO |   | ✔ |
- ACTIONS.ACK | A | ✔ | ✔ |
- ACTIONS.READ | R | ✔ | ✔ |
- ACTIONS.REDIRECT | RED |  | ✔ |
- ACTIONS.CHALLENGE | CH |  | ✔ |
- ACTIONS.CHALLENGE_RESPONSE | CHR |  | ✔ |
- ACTIONS.CREATE | C | ✔ | ✔ |
- ACTIONS.UPDATE | U | ✔ | ✔ |
- ACTIONS.PATCH | P | ✔ | ✔ |
- ACTIONS.DELETE | D | ✔ | ✔ |
- ACTIONS.SUBSCRIBE | S | ✔ | ✔ |
- ACTIONS.UNSUBSCRIBE | US | ✔ | ✔ |
- ACTIONS.HAS | H | ✔ | ✔ |
- ACTIONS.SNAPSHOT | SN | ✔ | ✔ |
- ACTIONS.LISTEN_SNAPSHOT | LSN | ✔ |  |
- ACTIONS.LISTEN | L | ✔ | ✔ |
- ACTIONS.UNLISTEN | UL | ✔ | ✔ |
- ACTIONS.LISTEN_ACCEPT | LA | ✔ | ✔ |
- ACTIONS.LISTEN_REJECT | LR | ✔ | ✔ |
- ACTIONS.SUBSCRIPTION_HAS_PROVIDER | SH | ✔ | ✔ |
- ACTIONS.SUBSCRIPTIONS_FOR_PATTERN_FOUND | SF | ✔ |  |
- ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND | SP | ✔ |  |
- ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED | SR | ✔ |  |
- ACTIONS.PROVIDER_UPDATE | PU | ✔ | ✔ |
- ACTIONS.QUERY | Q | ✔ | ✔ |
- ACTIONS.CREATEORREAD | CR | ✔ | ✔ |
- ACTIONS.EVENT | EVT | ✔ | ✔ |
- ACTIONS.ERROR | E | ✔ | ✔ |
- ACTIONS.REQUEST | REQ | ✔ | ✔|
- ACTIONS.RESPONSE | RES | ✔ | ✔ |
- ACTIONS.REJECTION | REJ | ✔ | ✔ |
{{/table}}
```

## Data Types
```
{{#table mode="pipe"}}
_default_columns: &COLS [name, value, server, client]
meta:
  options:
    header: *COLS
columns: *COLS
list:
- TYPES.STRING | S | ✔ | ✔ |
- TYPES.OBJECT | O | ✔ | ✔ |
- TYPES.NUMBER | N | ✔ | ✔ |
- TYPES.NULL | L | ✔ | ✔ |
- TYPES.TRUE | T | ✔ | ✔ |
- TYPES.FALSE | F | ✔ | ✔ |
- TYPES.UNDEFINED | U | ✔ | ✔ |
{{/table}}
```
