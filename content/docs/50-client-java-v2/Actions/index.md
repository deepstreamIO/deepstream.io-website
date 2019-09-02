---
title: Class Actions
description: All the actions in the deepstream client
---

Actions provide the intent of a message sent. A user of this sdk will only need to access these during error messages, such as via the DeepstreamException

## ACK
#### An acknowledgement from server

## CHALLENGE
### A connection challenge

## CHALLENGE_RESPONSE
#### A connection challenge response
## CREATE
#### A create to indicate record can be created if it doesn't exist
## CREATEANDUPDATE
#### A combination of both the create and update actions
## CREATEORREAD
#### A combination of both the create and read actions
## DELETE
#### Delete a record / be informed a record has been deleted
## ERROR
#### Error action to indicate something on the server did not go as expected
## EVENT
#### Inform the client a remote event has occured
## HAS
#### Action to enquire if record actually exists on deepstream
## LISTEN
#### Inform the server that it the client is willing to provide any subscription matching a pattern
## LISTEN_ACCEPT
#### Inform the server the provider is willing to provide the subscription
## LISTEN_REJECT
#### Inform the server the provider is not willing to provide the subscription
## PATCH
#### A path, meaning a specific part of data under a path has been updated
## PING
#### A heartbeat ping from server
## PONG
#### An heartbeat pong to server
## PRESENCE_JOIN
#### Called when a user logs in
## PRESENCE_LEAVE
#### Called when a user logs out
## QUERY
#### Used to query for clients
## READ
#### A request or response containing record data for a snapshot or subscription
## REDIRECT
#### A connection redirect to allow client to connect to other deepstream for load balancing
## REJECTION
#### Used to reject RPC requests
## REQUEST
#### A request to the server, used for RPC, authentication and connection
## RESPONSE
#### A response from the server for a request
## SNAPSHOT
#### Ask for the current state of a record
## SUBSCRIBE
#### Used to subscribe to most things, including events, records ( although records use CR ) and providing rpcs
## SUBSCRIPTION_FOR_PATTERN_FOUND
#### Used to inform the client listener that it has the opportunity to provide the data for a event or record subscription
## SUBSCRIPTION_FOR_PATTERN_REMOVED
#### Used to inform listener that it it is no longer required to provide the data for a event or record subscription
## SUBSCRIPTION_HAS_PROVIDER
#### Used to indicate if a record has a provider currently providing it data
## UNLISTEN
#### Inform the server that it the client is no longer willing to provide any subscription matching a pattern
## UNSUBSCRIBE
#### Used to unsubscribe to anything that was previously subscribed to
## UPDATE
#### An update, meaning all data in record has been updated
## WRITE_ACKNOWLEDGEMENT
#### Used when requiring write acknowledgements when setting records
