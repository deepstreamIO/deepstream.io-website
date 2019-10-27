[[glossary]]

| *Events* are deepstream's publish-subscribe mechanism. Clients and backend processes can subscribe to event-names (sometimes also called “topics” or “channels”) and receive messages published by other endpoints.

| Events are non-persistent, one-off messages. For persistent data, please use [records](/docs/client-js/datasync-record/).

| Events, aka Pub/Sub, allows communication using a Publish-Subscribe pattern. A client/server emits an event, which is known as publishing and all connected (subscribed) clients/servers are triggered with the event's payload if any. This is a common pattern, not just in realtime systems, but software engineering generally.