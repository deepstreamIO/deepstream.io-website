

## Understanding Permissions

Permissions allow you to specify if a user can create, write, read or delete a record, publish or subscribe to events, provide or make RPCs or get notified when other users come online. Deepstream uses a it's own realtime permission language called [Valve](/docs/general/valve/). 

When you create any new application on deepstream, the dashboard will contain a permissions file where you can modify the existing default permissions for your application.

For the color picker example, we need to ensure that each user is allowed to write to his/her own records only but can read others' records and listen to changes done by any user. Of course, each user must be able to create only his/her own records. The record section of the permissions file should look like the following:

```yaml
record:
  # for records with profile/$userId
  "profile/$userId":
    create: "user.id === $userId"
    write: "user.id === $userId"
    read: true
    delete: "user.id === $userId"
    listen: true
```

Of course, you can edit these to tweak the functionality of the application anytime.
