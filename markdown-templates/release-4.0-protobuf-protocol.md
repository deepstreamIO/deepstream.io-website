
## Binary Protocol

The driver behind pretty much all of the V4 refactor was our move from our old text based protocol to binary. It makes building SDKs and new features so much easier. Seriously. LIKE SO MUCH EASIER.

Okay so first things first, the structure of text vs binary messages:

### V3 -Text:

`TOPIC | ACTION | meta1 | meta2 | ...metaN | payload +`

This string had the initial TOPIC and ACTION read by the parser to find out where to route it, and the rest of the data was figured out within the code module that dealt with it. This gave some benefits like only parsing a full message once its actually required, but also meant that the message parsing code was distibuted and adding for example a meta field would require lots of refactoring. Tests also had to create text based messages even when testing internal code paths. Payload serialization also didn't use JSON, but instead used a custom form of serialization to minimize bandwidth: U for undefined, *T* for true, *F* for false, *O* for object, *S* prefix for string and a *N* prefix for number.

So the message object in V3 SDKs and server were like:

```json
{
    "topic": "R",
    "action": "S",
    "data": ["A", "recordName"]
}
```

###  V4 - Binary:

The binary protocol is implemented using protobuf. The decision to use proto was due to its wide support of other languages, it's ease of formats and how quickly we managed to get it implemented.

The main message is simply this:

```proto
message Message {
  TOPIC topic = 2;
  bytes message = 3;
}
```

While individual messages use a combination of an action enum and fields.

For example, the event message looks something like this:

```proto
message EventMessage {
    required RPC_ACTION action = 1;
    string data = 2;
    string correlationId = 3;
    bool isError = 4;
    bool isAck = 5;
    string name = 6;

    repeated string names = 7;
    string subscription = 8;

    TOPIC originalTOPIC = 10;
    EVENT_ACTION originalAction = 11;
}
```

An example representation that deepstream would get translated within the JS SDKs looks like this:

```javascript
{
    "topic": 3,
    "action": 2,
    "isAck": true,
    "name": "event"
}
```

This makes writing code alot easier. At the time of writing the full message API that can be consumed is as follows:

```typescript
export interface Message {
    topic: TOPIC
    action: ALL_ACTIONS
    name?: string

    isError?: boolean
    isAck?: boolean

    data?: string | Buffer
    parsedData?: RecordData | RPCResult | EventData | AuthData

    parseError?: false

    // listen
    subscription?: string

    originalTopic?: TOPIC | STATE_REGISTRY_TOPIC
    originalAction?: ALL_ACTIONS
    names?: Array<string>
    reason?: string

    // connection
    url?: string
    protocolVersion?: string

    // record
    isWriteAck?: boolean
    correlationId?: string
    path?: string
    version?: number
    versions?: { [index: string]: number }

    // state
    checksum?: number
    fullState?: Array<string>
    serverName?: string
    registryTopic?: TOPIC

    // cluster
    leaderScore?: number
    externalUrl?: string,
    role?: string

    // lock
    locked?: boolean
}
```

Using this approach has made adding new features and maintaining current ones significantly easier. And the given combination of TOPICs and ACTIONs we can pretty much ensure we'll be able to extend it without running out of space any time soon.

### Cons

It wouldn't be fair to say that this overhaul has no downsides. There have been some sacrifices that we had to make along the way.

1) If you count messages in the billions, those extra bytes add up. Data bandwidth is quite expensive on cloud systems so lack of compression isn't just a latency issue anymore. Protobuf has some very good compression algorithms which defeats JSON objects in most cases.

### Why yet another proprietry standard?

Because deepstream offers some very specific features, and has alot more on the way. For example we currently have a unique concept such as listening. Trying to use a realtime standard (which there aren't many of) would seriously hinder development. That being said deepstream allows swapping out of protocols quite easily as long as theres an interop layer so feel free to create compatability protocols to work with your favourite SDKs!
