---
title: Modelling relational data
description: An overview of relational data concepts using Records
tags: [relational, relational data, deepstream, records, sql]
---

## Relational data with deepstream

Relational databases are common in our industry, and quite often developers learn to model their data using relational techniques. Learning how to represent these common patterns in NoSQL solutions is hugely beneficial for both green field projects and enhancements for legacy software.

We're going to take a dive into representing some common relationships using deepstream's `Records`. These are tiny blobs of JSON that we can subscribe to, update and permission. They are persisted to both a cache and database, making writes quick, reads quicker and updates `realtime`.

### 1 - 1 relation

A way to model 1 - 1 data is often not needed in applications and traditional SQL databases. In most cases data can be merged into a single table or document/collection.

However sometimes we end up with a `customer` table like this:

|id|firstname|lastname|info|
|---|---|---|---|
|23|alex|harley|Like's pizza|

And a `customer_details` table like this:

|user_id|address|card_number|dob|
|---|---|---|---|
|23|Berlin|xxx-xxx-xxx-xxx|1901|

In these situations, it would never make sense for a `customer` to have multiple sets of `customer_details`, and it would never make sense for a `customer_details` row to belong to more than one `customer`. Here the relationship is strictly 1 - 1.

In terms of usage with deepstream, this could be useful if we don't always want to load a large amount of data for a user each time we fetch them. Or it may make sense to have a separate `Record` for a user's billing data that we don't need to fetch each time.

The way to model this data is to use a pointer to another `Record`, inside the original `Record`. It might look a bit like this:

###### users/abc-123

```javascript
{
    firstname: 'Alex',
    lastname: 'Smith',
    detailsRecord: 'details/abc-123'
}
```

##### details/abc-123
```javascript
{
    address: 'Berlin',
    cardNumber: 'xxx-xxx-xxx-xxx',
    dob: 1901
}
```

Now we can get a bit of info about a user at any time:

```javascript
const record = client.record.getRecord('users/abc-123')
record.whenReady((record) => {
    const { firstname, lastname, detailsRecord } = record.get()
})
```

And whenever the user themselves wants to look at their details or update them, it's as simple as:

```javascript
const detailsRec = client.record.getRecord(detailsRecord)
detailsRec.whenReady((record) => {
    const { address, cardNumber, dob } = record.get()
})
```

Another benefit of this is that it makes it super easy to permission different parts of the data set. Let's pretend that whenever we mouse-over a user we want to display their name and a bit of info about them. This way, we only need to fetch the `users/abc-123` `Record`.

However the only person that should be able to look at a users card details is themselves. So we can permission the details `Records` in a way to enforce this using [Valve](/tutorials/guides/valve-simple). The rule to do this might look a bit as follows, all we're doing is enforcing that the only user who can read and write to a `details/` record is the user themself.

```yaml
record:
  "details/$userId":
    read: "user.id === userId"
    write: "user.id === userId"
```

### 1 - n relation

Let's stay on track and look into a more involved example with some 1 - n relationships.

In long lived applications, it is quite common to find that users update their addresses for whatever reason. Usually this is fine, however in certain situations (often when payments are involved), we need to keep a history of those addresses. In this case, we have a 1 - n relationship where customers have multiple addresses.

With the relational model, we can end up with a `customer` table:

|id|firstname|lastname|
|---|---|---|
|23|alex|harley|

And an `address` table like this:

|user_id|street_address|city|post_code|country|
|---|---|---|---|---|---|
|23|123 Marienstrasse|Berlin|88763|Germany|

Where the `user_id` column has a foreign key constraint on the `id` column of the `customer` table.

Modelling this with deepstream is simple, instead of a pointer a `Record`, this time we just point towards a `List`.

###### users/abc-123
```javascript
{
    firstname: 'Alex',
    lastname: 'Smith',
    addresses: 'abc-123-addresses' // [ 'addresses/789', 'addresses/894 ]
}
```

This list `abc-123-addresses` itself just contains pointers to the actual address `Records`. One of these may look as follows:

###### addresses/789
```javascript
{
    streetAddress: '123 Marienstrasse',
    city: 'Berlin',
    postCode: '88763',
    country: 'Germany'
}
```

When it comes to fetching these addresses (assuming we already have the user `Record`), we can do this as follows and render them:

```javascript

// From user Record with id 'users/abc-123', asyncronously request the List id referenced in user property 'addresses'.  E.g. List id 'abc-123-addresses'
const addressList = client.record.getList('addresses')

// When List 'abc-123-addresses' is ready, iterate it's references to address Record ids.  E.g. Record id 'addresses/789'
addressList.whenReady((list) => {
    list.forEach(printAddress)
})

// Function passed to forEach() to print one particular address Record.  E.g. 'addresses/789'
const printAddress = (recordName) => {
    const record = client.record.getRecord(recordName)
    record.whenReady(record => console.log(record.get()))
}

// { streetAddress: '123 Marienstrasse', city: 'Berlin', postCode: '88763', country: 'Germany' }
// { streetAddress: '64 Engeldamm', city: 'Berlin', postCode: '12345', country: 'Germany' }
```

### m - n relation

Let's again take a more involved look into these relations and look at many - many relationships. There are a few different ways of doing this with `Records`, each with their own trade offs. Some are better suited for querying, some less so, but it all depends on the use case at hand.

Consider the social network situation where you have Groups and People, groups may contain many people and each person may belong to many groups. Using the relational model, it might look a bit like the following:

We have a `user` table:

|id|firstname|lastname|
|---|---|---|
|23|alex|harley|

And a `group` table like this:

|id|name|about|city|
|---|---|---|---|
|78|hiking|A place for hikers|Berlin|
|96|gaming|Gaming all day|Auckland|

Then a join table `groups_users` as follows:

|user_id|group_id|membership_type|
|---|---|---|---|
|23|78|admin|
|23|96|member|

Now let's have a look at doing this with `Records`.

##### A list pointer in each `Record`

Perhaps the most basic way of expressing a many - many relationship, we can simply reference a `List` in each `Record` in the dataset, that points to more data.

Here we have group `1234`, which has members interested in hiking and was created at `12345435`.

###### groups/1234
```javascript
{
    name: "hiking",
    created: 12345435,
    memberList: "members-1234" // [ "users/123", "users/124" ]
}
```

One of these users looks like this, and also contains a list of the groups they're a part of:

###### users/123
```javascript
{
    firstname: "Alex",
    lastname: "Smith",
    groupList: "groups-xyz" // [ "groups/1234" ]
}
```

This way of modelling data is very easy to reason about and makes it simple to query from both sides i.e. all the groups a user belongs to, and all the users in a group.

A downside however is that adding or removing a user from a group can be more complicated. We have to do two writes/deletes, once on the users side and once on the groups side.

##### An intermediary relationship `Record`

The above example is great for just expressing a relationship between records, but if we want to have any extra data associated with these we'll need an intermediary `Record` to store additional metadata about the relationship. In this case, we may want to have a users type of membership in a group.

Let's have a look at how one of these `Records` would be structured:

###### memberships/q6756i9
```javascript
{
    type: "admin",
    joined: 12787434,
    referrals: 8
}
```

From here, both groups and user `Records` will point to lists that contain these.

###### users/123
```javascript
{
    firstname: "Alex",
    lastname: "Smith",
    memberships: "memberships-123" // [ memberships/q6756i9 ]
}
```

###### groups/1234
```javascript
{
    name: "hiking",
    created: 12345435,
    memberships: "memberships-1234" // [ memberships/q6756i9 ]
}
```

The basic idea around fetching data from this type of setup, is that we need to load, a couple of different `Lists` and `Records` to get everything we need. Let's quickly cover some example queries we can do with this:

##### Adding a user to our hiking group

The first thing we need to do is get references to our group and user `Records`. From here we need to create our new membership record. Under the hood, the `getRecord` function actually does a `CREATE OR READ` call, so the syntax for getting and creating `Records` is the same.

```javascript
const groupRecord = client.record.getRecord('groups/1234')
const userRecord = client.record.getRecord('users/123')
const mId = `memberships/${client.getUid()}`
const membershipRecord = client.record.getRecord(mId)
```

Next we need to set the data of our membership `Record`, for now we only have the `type`, `joined` and `referrals` properties.

```javascript
membershipRecord.set({
    userId: 'users/123',
    groupId: 'groups/1234',
    type: "user", // could be admin, organiser, etc
    joined: Date.now(),
    referrals: 0
})
```

Lastly we just need to add this membership `Record` to the user and group membership `Lists`. For brevity I'll just show adding the membership to the group, however the code is exactly the same for adding to the user membership list.

```javascript
const membershipListName = groupRecord.get('memberships')
const groupList = client.record.getList(membershipListName)
groupList.addEntry(mId)
```

And now we have a relationship between two entities in our application. The code for removing a user from a group, would also be very similar.

##### Getting all members of our hiking group and when they joined

Let's say we wanted to list all members of our hiking group. This is pretty simple and can be accomplished very quickly. First we just need to get a reference to our group `Record`, and then call our `enumerateMembers` function with our membership list.

```javascript
const record = client.record.getRecord('groups/1234')
record.whenReady((record) => {
    enumerateMembers(record.get('memberships'))
})
```

Our `enumerateMembers` function simply gets the `Record` for each of our memberships. It calls both the `displayUser` function with the users Id and when they joined.

```javascript
function enumerateMembers(memberList) {
    memberList.forEach((membershipId) => {
        const memberRecord = client.record.getRecord(membership)
        memberRecord.whenReady(record => {
            displayUser(record.get('userId'), record.get('joined'))
        })
    }
}
```

Finally our `displayUser` function just loads the users `Record` and logs their name and when they joined the hiking group.

```javascript
function displayUser(userId, joined) {
    const userRecord = client.record.getRecord(userId)
    userRecord.whenReady((record) => {
        console.log(`${record.get('firstname')} has been in the hiking group since ${formatDate(joined)}`)
    })
}
```

And just like that, it's pretty easy to query all kinds of different things with this set up. Finding all of a user's groups would be a similar exercise to what we've just done, however I'll leave that up to you.
