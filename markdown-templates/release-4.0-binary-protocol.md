The driver behind pretty much all of the V4 refactor was our move from our old text based protocol to binary. Before you ask, while we might add actual binary data support in deepstream we still currently use it to parse JSON payloads. But it makes building SDKs and new features so much easier. Seriously. LIKE SO MUCH EASIER.

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

```
 /*
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-------------+-+-------------+-------------------------------+
 * |F|  Message    |A|  Message    |             Meta              |
 * |I|   Topic     |C|  Action     |            Length             |
 * |N|    (7)      |K|   (7)       |             (24)              |
 * +-+-------------+-+-------------+-------------------------------+
 * | Meta Cont.    |              Payload Length (24)              |
 * +---------------+-----------------------------------------------+
 * :                     Meta Data (Meta Length * 8)               :
 * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 * |                  Payload Data (Payload Length * 8)            :
 * +---------------------------------------------------------------+
 *
 * The first 6 bytes of the message are the header, and the rest of 
 * the message is the payload.
 *
 * CONT (1 bit): The continuation bit. If this is set, the following
 * payload of the following message must be appended to this one. 
 * If this is not set, parsing may finish after the payload is read.
 *
 * RSV{0..3} (1 bit): Reserved for extension.
 *
 * Meta Length (24 bits, unsigned big-endian): The total length of 
 *                Meta Data in bytes.
 *                If Meta Data can be no longer than 16 MB.
 *
 * Payload Length (24 bits, unsigned big-endian): The total length of 
 *                Payload in bytes.
 *                If Payload is longer than 16 MB, it must be split into 
 *                chunks of less than 2^24 bytes with identical topic and
 *                action, setting the CONT bit in all but the final chunk.
 */
 ```

The binary protocol is utf8 based, with some bit shifting for things like ACKs for easier parsing. The only time deepstream actually creates or sees this object is in the parser itself, meaning as far as the code is concerned the actual protocol can change at any time.

The objects used within V4 SDKs and server look like this:

```javascript
{
    "topic": 3,
    "action": 2,
    "isAck": true,
    "name": "recordName"
}
```

This makes writing code alot easier. At the time of writing out full message API that can be consumed by any SDK is as follows:

```typescript
export interface Message {
    topic: TOPIC
    action: ALL_ACTIONS
    name?: string

    isError?: boolean
    isAck?: boolean

    isBulk?: boolean
    bulkId?: number
    bulkAction?: ALL_ACTIONS

    data?: string | Buffer
    parsedData?: RecordData | RPCResult | EventData | AuthData
    payloadEncoding?: PAYLOAD_ENCODING

    parseError?: false

    raw?: string | Buffer

    originalTopic?: TOPIC
    originalAction?: ALL_ACTIONS
    subscription?: string
    names?: Array<string>
    isWriteAck?: boolean
    correlationId?: string
    path?: string
    version?: number
    reason?: string
    url?: string
    protocolVersion?: string
}
```

Using this approach has made adding new features and maintaining current ones significantly easier. And the given the combination of TOPICs and ACTIONs we can pretty much ensure we'll be able to extend it without running out of space any time soon.

### Cons

It wouldn't be fair to say that this overhaul has no downsides. There have been some sacrifices that we had to make along the way.

1) If you count messages in the billions, those extra control bytes add up. Data bandwidth is quite expensive on cloud systems so lack of compression isn't just a latency issue anymore.

2) Our meta data is a JSON object. It's predefined meaning we can have a much more optimial parser than those built in, and we minimize space by using abbreviations for the metadata names. However it still takes longer to parse and more bandwidth to transfer. There are optimizations planned to allow all this to happen further down in C++ land to reduce the weight of this occuring on the main node thread, but it's a small step back in optimal performance.

### Why yet another proprietry protocol?

Because deepstream offers some very specific features, and has alot more on the way. For example we currently have a unique concept such as listening. We are also looking to release a monitoring topic in the 4.1 release, better OS clustering integration in 4.2 and an admin API in 4.3. Tying into another stack means we unfortunately can't move as quickly as we want with these features.
