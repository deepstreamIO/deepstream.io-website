---
title: Anonymous Record
description: Learn how to use anonymous records to switch context without having to renew bindings
---

AnonymousRecord is a record without a predefined name. It functions as a wrapper around an actual record that can be swapped out for another while keeping all bindings intact.

An anonymousRecord extends `Record` and contains all of its [API calls](/docs/client-js/datasync-record/).

To learn more about how they are used, have a look at the [AnonymousRecord Tutorial](/tutorials/core/datasync-anonymous-records/).

## Creating an anonymousRecord

AnonymousRecords are created and retrieved using `client.record.getAnonymousRecord('name')`

```javascript
const anonymousRecord = client.record.getAnonymousRecord()
```

## Events

### nameChanged
The new name of the underlying record which the anonymous record now represents.

## Methods

### setName(recordName)
```
{{#table mode="api"}}
-
  arg: recordName
  typ: String
  opt: false
  des: The name of the actual record the anonymousRecord should use. This can be called multiple times.
{{/table}}
```
Sets the underlying record the `anonymousRecord` wraps around. It takes care of cleaning up the previous record on your behalf.

```javascript
const anonymousRecord = client.record.getAnonymousRecord()
anonymousRecord.setName('user/john-snow')
```
