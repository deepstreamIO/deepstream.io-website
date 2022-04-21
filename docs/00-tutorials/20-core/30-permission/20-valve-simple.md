---
title: Valve Simple
description: Learn the basics of Valve and permissions in deepstream
---

Permissions give you granular control over which records, events or RPCs can be used in which way by which user.

## What can be permissioned?
Permissions allow you to specify if a user can create, write, read or delete a record, publish or subscribe to events, provide and make RPCs or listen to other client's subscriptions.

## How do permissions work?
deepstream uses a permission syntax called "Valve". Valve rules are simple javascript strings with a reduced feature-set. Each valve rule defines access to a specific action related to a specific concept, e.g. a "write" to a "record".

Here's what they look like:

```yaml
record:
    # an auctioned item
    auction/item/$sellerId/$itemId:
        # everyone can see the item and its price
        read: true

        # only users with canBid flag in their authData can bid
        # and bids can only be higher than the current price
        write: "user.data.canBid && data.price > oldData.price"

        # only the seller can delete the item
        delete: "user.id == $sellerId"
```

## How to use Valve rules?
Valve rules can be written in YAML or JSON in the `permissions` file (path in `permissions/options/path` in `config.yml`).

The file has three levels of nesting:
Type (record, event or rpc)
    - Name (record, event or rpc name)
        - Action( read, write, delete, publish etc.)

## Let's start with a simple example
Let's say we're building a notification system that allows users to send their status as event (a mini Twitter if you like). Every user can subscribe to another user's status, but users can only publish their own status updates.

First, let's define default actions for all events. Our example platform is open, so generally everyone can publish and subscribe. Listening is not part of the platform, so let's just turn it off altogether:

```yaml
event:
    "*":
        publish: true
        subscribe: true
        listen: false
```

Next, let's define rules for our status events. Our event names will follow the schema `user-status/<username>`, e.g. `user-status/lisa`:

```yaml
event:
    "*":
        publish: true
        subscribe: true
        listen: false
    user-status/$userId:
        publish: "user.id === $userId" #users can only share their own status
```

This example introduced two basic concepts:

* **specificity** Valve uses a simple specificity concept to find out which rule to apply: The longest (e.g. most detailed) rule wins. `user-status/$userId` is longer than the general rule `"*"`, so for publish operations it will be applied. For subscribe and listen though, the permission will fall back to the general rule `"*"`.

* **path variables** dollar prefixes identify parts of a record, RPC or eventname as variables, e.g. `$userId` in `user-status/$userId`. These variables will be made available within the permission rule. Using e.g. the username as part of the record name for records with access restrictions is a central concept in valve.

## What's next?
This was a quick introduction to what valve can do, but there are more powerful concepts, such as build-in variables, string-functions or cross-references to explore. To learn about these, let's move on to the [advanced permission tutorial](/docs/tutorials/core/permission/valve-advanced/)
