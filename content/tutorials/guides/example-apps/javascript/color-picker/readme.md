---
title: Color Picker App using JS
description: Create a pie chart to show all the logged in users
tags: JavaScript, Presence, Records, OpenAuth
---

This tutorial is mainly focused on the [presence](/tutorials/guides/presence/) feature of deepstream and serves as a step by step guide for building a client side application in deepstream that uses prsenece. 

This application will allow a client to log into deepstream and choose a color of his/her choice from the available color pallette. A pie chart will be produced that updates in real time to show the colors chosen by all the users currently logged into the application. Here's a sample of how it will look like:

![Demo output](newscreenrecordhalf.gif)

We will make use of a JS client library. Include it in your application as follows:

```html
<script src="https://code.deepstreamhub.com/js/latest/deepstream.min.js"></script>
```

Create a file named script.js and just follow along.

## Setting up deepstream

Create a new application on deepstreamHub, you will get an App URL from your dashboard. Now switch back to script.js. For any application that uses deepstream, we first need to establish a connection to the deepstream server using the following statement:

```javascript
var client = deepstream('<YOUR APP URL>',<ADDITIONAL OPTIONS>)
```

The second parameter is optional. You can get more information about them, [here](/docs/general/options/).

In deepstream, logging errors is easy where you just have to pass an error message to the event callback, as shown below.

```javascript
  client.on('error',function(error,event,topic) {
  console.error(error,event,topic)
})
```

## Logging in using OpenAuth

The next step is to login and initialize the application. In this example we use Open Authentication, feel free to refer the [Authentication](/docs/general/authentication/) page to try out other types of authentication.

```javascript
client.login({},function(success,data) {
  if(!success) {
    console.log('failed to login')
    return
  }
  //called when login is successful
  initializeApplication(data)
})
```

The login method usually has two arguments. The first one is authParams which is optional depending on the type of authentication the client chooses. The second argument is a callback function with two parameters - success and data. You can know more about the login method from the [Javascript-Client](/docs/client-js/client/)documentation page.

The data returned consists of client specific data such as user id and sometimes it may also contain other information.

## Using the presence feature

Once we have logged in we can start reacting to users logging in and out by doing the following:

```js
function initializeApplication(data) {
    //store the client's id
    userId = data.id
    //initializes the function to pick the color
    initialiseColorPicker('#color-picker', onColorSelected);
    client.presence.getAll(function(ids) {
        //manually push our userId into the above list
        ids.push(userId)
        //calls the function for each userId currently logged in
        ids.forEach(userLoggedIn)
    })
    //called whenever an authenticated client logs in or out
    client.presence.subscribe(function(id, login) {
        if (login === true) {
            userLoggedIn(id)
        } else {
            userLoggedOut(id)
        }
    });
}
```
The presence feature essentially allows us to query on the connected authenticated clients. The getAll method returns the userIds of all the authenticated connected clients except for ours. Hence, we need to manually push our userId as shown above.

Next, we make the client subscribe to presence events using the subscribe method. The subscribe method has two arguments, the username and login. The logic inside this function can be implemented according to our use case. Here, we perform some operations if the user is logged in and if the user is logged out, we just delete the record with the particular userId. What are records? Hold on! That's what we have next.

Meanwhile, you can read more about how the presence methods work for a js-client, [here](/docs/client-js/presence/).

## Understanding Records

Records are the documents in deepstream's realtime datastore. A record is identified by a unique id and can contain an object. Clients and backend processes can create, read, write, update and observe the entire record as well as paths within it. Any change is immediately synchronized amongst all connected subscribers. You can explore all about records for js-client, [here](/docs/client-js/datasync-record/).

For our example, we are retrieving all the records with the userIds and storing them in a locally created array variable. Using this, we get access to their records, mainly the color which they chose which can later be used to update the pie chart.

The render function is essentially responsible for generating the pie chart. We will see how it's done, further down the tutorial.

Declare an empty object named userRecords as follows:

```javascript
var usersRecords = {};

function userLoggedIn(id) {
    //retrieves records with the given name pattern
    usersRecords[id] = client.record.getRecord('users/' + id)
    //subscribes to changes and fires a callback function
    usersRecords[id].subscribe('color', render, true)
}
```
Inside the function userLoggedIn, we call the [subscribe](/docs/client-js/datasync-record/#subscribe-path-callback-triggernow-) method which lets the client register a callback whenever there is any change to any of the records belonging to any of the users.

Similarly we create a userLoggedOut function using which we permanently delete the user record and then call the render function. 

```javascript
function userLoggedOut(id) {
  //deletes user record
  delete usersRecords[id]
  render()
}

```

Finally, we make sure to delete the user before he/she closes the browser window where the application is running.

```javascript
window.onbeforeunload = function (e) {
  // make sure the user has permission to delete
  // Read more about permissions below
  usersRecords[userId].delete();
}

```

Now we are left with the render function which contains the logic for displaying the results from the above methods on screen, in terms of a pie chart. For our example, we use chart.js. Feel free to check out the render function and the complete code in the live demo at the end of this page.

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


## Live demo
{{> live-demo
    htmlUrl="https://cdn.rawgit.com/deepstreamIO/ds-demo-presence-colorpicker/master/index.html"
    cssUrl="https://cdn.rawgit.com/deepstreamIO/ds-demo-presence-colorpicker/master/styles.css"
    jsUrl="https://cdn.rawgit.com/deepstreamIO/ds-demo-presence-colorpicker/master/script.js"
}}