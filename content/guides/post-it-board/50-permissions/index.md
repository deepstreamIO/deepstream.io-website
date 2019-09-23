---
title: Permissioning it all
description: Adding some permissions
---

## Permissions

Deepstream comes with a powerful permissioning language called Valve, which can be used to create rules to allow/deny all possible client actions. Going back to our last requirement, we want to only allow the creator to update his/her own cards. Since we’ve made the username part of the recordname, this is rather straightforward. Let’s take a look at how we can implement that in our pemission.yml config file.

```yaml
record:
  "postits/.*":
    write: "data.owner === user.id"
```


And that’s it. The users who can edit cards have to be the same as the cards’ creators.
Let’s introduce a tiny bit of scope creep, and allow the scrum-master to edit any card and be the only one who can delete cards. Luckily, we added this earlier on in the user config, so we have access to user roles.

```yaml
record:
  "postits/.*":
    write: "data.owner === user.id || user.id === 'scrum-master'"
    delete: "user.data.role === 'scrum-master'"
```