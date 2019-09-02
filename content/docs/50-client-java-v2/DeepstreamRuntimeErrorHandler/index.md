---
title: Class DeepstreamRuntimeErrorHandler
description: Allows for all runtime errors to be caught in a single place
category: interface
navLabel: DeepstreamRuntimeErrorHandler
body_class: dark
---

This interface allows to handle common errors centrally rather than in numerous try/catch clauses.

Please note: Errors that are specific to a request, e.g. a RPC timing out or a record not being permissioned are either passed directly to the method that requested them or will be caught by a more specific listener.

## Methods

### void onException(Topic topic, Event event, String errorMessage)

```
{{#table mode="java-api"}}
-
  arg: topic
  typ: Topic
  des: The Topic the error occured on
-
  arg: event
  typ: Event
  des: The Error Event
-
  arg: errorMessage
  typ: String
  des: The error message
{{/table}}
```

Triggered whenever a runtime error occurs ( mostly async such as TimeOuts or MergeConflicts ). Recieves a topic to indicate if it was e.g. RPC, event and a english error message to simplify debugging.

