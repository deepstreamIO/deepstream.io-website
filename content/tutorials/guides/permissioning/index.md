---
title: Permissioning
description: Learn permissioning with Valve
---

deepstream uses a powerful permission-language called Valve that allows you to specify which user can perform which action with which data.

With Valve you can
- Restrict access for individual users or groups
- Permission individual actions (e.g. write, publish or listen)
- Permission individual records, events or rpcs
- validate incoming data
- compare against stored data

## Requirements
For this tutorial it's helpful to know your way around the deepstream [
configuration](/docs/server/configuration/) as we'll need to tell
the server where we stored our permissioning rules. deepstream supports a
variety of communication concepts such as data-sync, publish-subscribe or request-response and _Valve_ is flexible enough to allow different rules for each concept. This guide will mostly focus on [records](/tutorials/core/datasync/records/), so it'd be good to familiarize yourself with them. Since permissioning is fundamentally about the rights of individual clients, it would also be good to know how [user authentication](/tutorials/core/security/) works in deepstream.

### Let's start with an example
Imagine you are running a discussion forum. To avoid vandalism and spam, users
have to wait 24 hours before they can create new posts or modify existing posts
after registration. 
This means we'll need to store the time the user registered along with their account information. This can be done dynamically using [http authentication](/tutorials/core/auth/http-webhook/), but to keep things simple for this tutorial we'll just store it as `timestamp` within the `serverData` using deepstream's file-based authentication. A user entry in `conf/users.yml` might look as follows:
```yaml
JohnDoe:
	password: gvb4563Z
	serverData:
		timestamp: 1482256123052
```
The snippet above shows a user `JohnDoe`. The server hosting the forum needs to
know when John Doe registered so there is a `timestamp` in the `serverData`
section.

With deepstream as a back-end, it makes sense to store all forum threads in
records (this is the [data-sync concept](/tutorials/core/datasync/records/)).
The following Valve snippet gives new users read-only access:
```yaml
record:
	"*":
		read: true
		listen: true
		delete: false
		create: "user.data.timestamp + 24 * 3600 * 1000 < now"
		write: "user.data.timestamp + 24 * 3600 * 1000 < now"
```
The `record` label signifies that the following rules apply to operations
involving records; the pattern in the line below is a wild card matching every
record name. In deepstream, records can be created, written to, deleted, read from, and you can listen to clients subscribing to a record. With Valve, you can have different permissions for each of these actions. In the Valve snippet
above, we permit everyone to read records, listen to subscription, and we
disallow record deletion. Finally, in the last two lines we grant users `create`
and `write` permissions only if the accounts are older than 24 hours by
comparing the `timestamp` from the user's `serverData` with the current time; `now` returns [Unix time](https://en.wikipedia.org/wiki/Unix_time) like `Date.now()`
in JavaScript, in milliseconds and 24 \* 3600 \* 1000 milliseconds are 24 hours.

Lastly, we need to update the config file to make use of our custom
permissions. Assuming we stored the permissions in the path
`conf/permissions.yml`, we can instruct the deepstream server to load our
settings with the following lines in `conf/config.yml`:
```yaml
permission:
	type: config
	options:
		path: ./permissions.yml
```

As you saw above, setting up deepstream's file-based permissioning facilities
requires a file with permissioning rules, changes to the configuration file, and optionally some user-specific data.

## Permissioning
A generic Valve rule might look as follows:
```yaml
concept:
	"pattern":
		action: "expression"
```
For every action, there is usually a corresponding function in the client API,
e.g., the record `write` permissions are needed when calling `record.set()` in
the JavaScript client API. Every record, RPC, event, and authenticated user in
deepstream possesses a unique identifier (a name) and if Valve wants to find out
if a certain operation is permitted, then
- it looks for the appropriate section in the permissioning file for records,
  RPCs, or events, and so on,
- it searches for the rule with the best match between pattern and identifier,
  and
- it evaluates the right-hand side expression.
In the following paragraphs, we present the possible actions.


### File Format

The Valve language uses [YAML](https://en.wikipedia.org/wiki/YAML) or
[JSON](https://en.wikipedia.org/wiki/JSON) file format and the file with the
permissioning rules must always contain rules for every possible identifier
because the server will not supply default values. Note that the deepstream
server ships with a permissions file in `conf/permissions.yml` which permits
every action. Valve is designed to first and foremost use identifiers to match
permissionable objects with corresponding rules. Thus, identifiers should be
chosen such that rules can be selected only based on the identifier.


### Identifier Matching

Valve can match identifiers using fixed (sub-)strings, wild cards, and
placeholders (with deepstream, we call them _path variables_); these
placeholders can be used in the expressions. Suppose we store a user's first
name, middle name, and last name in the format
`name/lastname/middlename/firstname` and have a look at the following Valve
code:

```yaml
presence:
	'name/Doe/$middlename/$firstname':
		allow: false
```
User names that match this rule are, e.g., John Adam Doe (in this case, the
record identifier is `name/Doe/Adam/John`) or Jane Eve Doe
(`name/Doe/Eve/Jane`); in the former case, `$firstname === 'John'` and in the
latter case `$firstname === 'Jane'`.

The wild card symbol in Valve is the asterisk (the symbol `*`) and `*` matches
every character until the end of the string. Placeholders start with a dollar
sign followed by alphanumeric characters and match everything until a slash is
encountered. In principle, identifiers can contain any character. Nevertheless,
if you use an asterisk in an identifier, deepstream offers no way to match
specifically this character.


### Expressions

After identifier matching, deepstream will evaluate the right-hand side
expression. The expression can use a subset of JavaScript including
- arithmetic expressions,
- the [conditional operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator),
- comparison operators,
- the string functions `startsWith`, `endsWith`, `indexOf`, `match`,
  `toUpperCase`, `toLowerCase`, and `trim`.

Additionally, you can use the current time (on the server) with `now`, you can
access deepstream data, and cross-reference records.

Any deepstream client needs to log onto the server and the user data can be
accessed with Valve but note that user's are not necessarily authenticated
unless this is forbidden in the config. You can check for authenticated users
with `user.isAuthenticated` (the ternary operator `?:` may prove useful when checking
this property). If a client authenticated, its user name can be accessed with
`user.name` and its server data with `user.data`.  Additionally, Valve allows
you to examine data associated with a rule, e.g., for a record, this means one
can examine old and new value.  Since the data is dependent on the type (record,
event, or RPC, and so on), we will discuss this detail in the sections on the
specific types.

Valve gives you the ability to cross reference data in your records. In your
right-hand side expression, use the term `_(identifier)` to access the record
with the given identifier, where `identifier` is interpreted as a JavaScript
expression returning a string, e.g., `_('family/' + $lastname)`. The cross
referenced record must exist. Note that cross references ignore Valve
permissions meaning you gain indirect read access irrespective of the Valve
rules.

When evaluating expressions, you need to keep several pitfalls in mind. Using
the current time with `now` requires you to consider the usual [limitations of
time-dependent
operations](http://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time)
on computers and additionally, `now` is evaluated on the server; you should keep
this in mind whenever a client uses the _current_ time in its code. Valve allows
you to cross reference stored data but this is computationally expensive. Thus,
the default config shipped with deepstream allows no more than three cross
references as of December 21, 2016. Finally, the usual warnings about type
coercion (implicit type conversions), [JavaScript comparison
operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators),
and [floating-point arithmetic](http://www.w3schools.com/js/js_numbers.asp)
apply.


### Records

Records can be created, deleted, read from, written to, and you can _listen_ to
other clients subscribing to records (the [record tutorial](/tutorials/core/datasync/records/)
elaborates on these operations and it explains the differences between
unsubscribing from, discarding, and deleting records). The following snippet is
the default Valve code for records:
```yaml
record:
	"*":
		create: true # client.record.getRecord()
		read: true # client.record.getRecord(), record.get()
		write: true # record.set()
		listen: true # record.listen()
		delete: false # record.delete()
```
In Valve, you can access the current record contents by referencing `oldData`
and for the `write` operation, the modified record can be examined with `data`.

Note that `create` permissions are only invoked by `getRecord()` if the
requested record does not exist, otherwise only reading rights are required.
Similarly, writes are always successful if the record does not have to be
modified, e.g., modified and unmodified record are identical. Moreover, if a
write operation is rejected by the server, then the client must handle the
resulting error message; otherwise the client copy of the record will be out of
sync with the server state. Finally, do not mix up the `path` given to
`record.get()` and `record.set()` with the record _identifier_ that is used by
Valve.


### User Presence

deepstream can notify you when authenticated users log in. The permissioning key
is called `presence` and the only option is to allow or disallow listening:
```yaml
presence:
	"*":
		allow: true # client.subscribe()
```


### Events

[Events](/tutorials/core/pubsub/) can be published and subscribed to.
Moreover, a client emitting events may listen to event subscriptions. The
actions can be permissioned in the section `events`:
```yaml
events:
	"*":
		publish: true # client.event.emit()
		subscribe: true # client.event.subscribe()
		listen: true # client.event.listen()
```
The `publish` action allows the examination of the data by referencing `data` in
the expression.


### RPCs

[Remote procedure calls](/tutorials/core/request-response/) can be provided
or requested. The corresponding permissioning section is identified by the key
`rpc`:
```yaml
rpc:
	"*":
		provide: true # client.rpc.provide()
		request: true # client.rpc.make()
```


### Configuring for File-Based Permissioning

To use file-based permissioning, the config file must contain the key
`permission.type` with the value `config`. The name of the permissioning file
must be provided in the deepstream config file under the key
`permission.options.path` and can be chosen arbitrarily. If a relative path is
used to indicate its location, then this path uses the directory containing the
config file as base directory.

In summary, if the permissioning rules can be found in `conf/permissions.yml`
and if the configuration file is `conf/config.yml`, then a minimal config for
file-based permissioning looks as follows:
```yaml
permission:
	type: config
	options:
		path: ./permissions.yml
```


## Further Reading

More compact introductions (or refreshers) are the tutorials [_Valve
Permissioning Simple_](/tutorials/core/permission/conf-simple/), [_Valve
Permissioning Advanced_](/tutorials/core/permission/conf-advanced/), and
[_Dynamic Permissions using Valve_](/tutorials/core/permissions/dynamic/). To learn how to sent user-specific data using Valve, have a look at the [user-specific data guide](/tutorials/guides/user-specific-data/).
