---
title: Valve Permissions
description: The API for Valve, deepstream's powerful permissioning mechanism
---

## Rule Types
You can specify permission rules for the following interactions

### record
- `create` triggered when a record is requested for the first time
- `write` operations that change a record's data. (PATCH & UPDATE)
- `read` reading a record's data
- `delete` deleting a record
- `listen` listen for other clients subscribing to a record
- `notify` whether or not the client can notify of records updated directly in database

### event
- `publish` sending events
- `subscribe` subscribing for events
- `listen` listen for other clients subscribing to events

### rpc
- `provide` registering a client as a RPC provider
- `request` making a remote procedure call

### presence
- `allow` query for connected authenticated clients


## Variables
These variables are available for use within a permission rule

### user
the authentication data for the user attempting the read or write, containing the following keys:

```javascript
{
    //Boolean, false if id === 'open'
    isAuthenticated: true, //Boolean
    //the userId / username as returned by auth the auth provider
    id: 'johndoe', //String
    //optional object, containing fields like e.g. role, access level etc
    //returned by auth provider
    data: { role: 'admin' } //Object
}
```

**Usage Example:** write to record `user-profile` is only allowed for owner
```yaml
record:
  user-profile/$username:
    write: "user.id === $username"
```

### data
the incoming data for records, events and rpcs

**Usage Example:** only allow publishing of event if it has more than 50 likes
```yaml
event:
  facebook-news:
    publish: "data.likes > 50"
```

### oldData
the current data, only for records

**Usage Example:** Only allow bids higher than the current price
```yaml
record:
  item/*:
    write: "data.bid > oldData.bid"
```

### now
current timestamp on the server in ms

**Usage Example:** Only allow scheduling appointments in the future
```yaml
rpc:
  schedule-appointment:
    request: "data.desiredDate > now"
```

### action
the original action that triggered this rule (e.g. UPDATE / PATCH / LISTEN ) etc. Useful for more finegrained/low-level permissions. You can find a list of all available actions [here](/docs/common/constants/)

**Usage Example:** Only allow patch updates
```yaml
record:
  user-profile/:
    write: "data.action === 'PATCH'"
```

### $variableName
Variables that are extruded from the record / event / rpc name. Names can contain multiple variables. Variable names start with a dollar and are only allowed to contain uppercase letters, lowercase letters and numbers.

**Usage Examples:**
```yaml
record:
  user-profile/$userId:
    # make sure users can only manipulate their own profile
    write: "$userId === user.id"
event:
  # Make sure the headline for `pet-news/pugs` contains the word pug
  pet-news/$pet:
    publish: "data.headline.indexOf( $pet ) !== -1"

```

## Cross reference

### _(recordName)

Only for records. Cross-references another record and makes the other record's data available for the permission rule.

**Usage Example:**
```yaml
record:
  car-sale/$transactionId:
    # when booking a new car sale, make sure that
    # the car that's sold exists and that its price
    # is the same or lower than what the customer is charged
    write: "_(data.carId) !== null && _(data.carId).price >= data.price"

```

## String functions
Valve supports the following string functions
- `startsWith`
- `endsWith`
- `indexOf`
- `match`
- `toUpperCase`
- `toLowerCase`
- `trim`

**Usage Example:** make sure a postcode only contains numbers
```yaml
record:
    address/*:
      write: "data.postcode && data.postcode.match( /^[0-9]*$/ )"
```
