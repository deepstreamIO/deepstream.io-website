## Using the presence feature

Once we have logged in we can start reacting to users logging in and out by doing the following:

```javascript
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
