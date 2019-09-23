## Understanding Records

Records are the documents in deepstream's realtime datastore. A record is identified by a unique id and can contain an object. Clients and backend processes can create, read, write, update and observe the entire record as well as paths within it. Any change is immediately synchronized amongst all connected subscribers. You can explore all about records for js-client, [here](/docs/client-js/datasync-record/).

For our example, we are retrieving all the records with the userIds and storing them in a locally created array variable. Using this, we get access to their records, mainly the color which they chose which can later be used to update the pie chart.

The render function is essentially responsible for generating the pie chart. We will see how it's done, further down the tutorial.

Declare an empty object named userRecords as follows:

```javascript
const usersRecords = {};

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