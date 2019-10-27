---
title: Permissioning it all
description: "Step six: Adding some permissions"
---

So our app is now up and running, but before you can go and deploy this for the world you probably want to first add some permissions to stop people directly manipulating your data in an invalid way.

The permissions we want to add are:

- Only allow users to edit their own postits
- Only allow users to add postits
- Only allow an admin user to delete postits

In order to this we will be using a powerful permission language called Valve. This allows us to create rules that can validate every message that comes from a client before it effects any state at all on the server.

In order to permission the data we'll need to have access to the users id and role. The will be required in order to solve our applications requirements. In order to do 

### Only allow users to edit their own postits

Comparing the users id with an id in the payload or the actual record name is the perfect way to guarantee only the specific user can edit their own postit

You can access the id on a user simply by referencing the `user.id` property. The userid here is the one that is returned by the storage adaptor we setup earlier 

```yaml
record:
  "postits/.*":
    write: "data.owner === user.id"
```

Or if you you want to be a bit more specific, you could instead allow any user to move cards around but just not 
edit the content. This can be done by loading up the previous content up and doing a comparison.

```yaml
record:
  "postits/.*":
    write: "data.owner === user.id || (_(name).content === data.content && _(name).owner === data.owner)"
```

And that’s it. The users who can edit cards have to be the same as the cards’ creators.
