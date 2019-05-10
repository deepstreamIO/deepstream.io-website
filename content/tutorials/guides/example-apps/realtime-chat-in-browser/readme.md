---
title: Realtime Chat in Browser
description: Learn how to create a realtime chat app in the browser
tags: Javascript, Angular, lists, records
navLabel: Realtime Chat in Browser
---

Let's build a realtime chat App in browser. We'll be implementing quite a few features and showing you just how easy it is to do this with deepstreamHub. Upon completion you will be able to:

- view a list of users and whether they are online or offline

- chat with users on a one-to-one basis

- get all the chat history


This tutorial covers a lot of concepts in deepstreamHub and we'd definitely recommend being familiar with [Records](/tutorials/core/datasync/records/) and [Lists](/tutorials/guides/lists) before giving this a go, additionally [Angular](/tutorials/getting-started/angularjs/) and [Javascript](/tutorials/getting-started/javascript/) experience will be helpful as well.

If you have any questions please take a look at the GitHub [repository](https://github.com/deepstreamIO/dsh-demo-webApp-chat) or [get in touch](/contact).

{{> start-deepstream-server}}

## Connect to deepstream and log in

To get started, include the JS-client library

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/deepstream.io-client-js/2.1.1/deepstream.js"></script>
```

Get your app url from the dashboard and establish a connection to deepstreamHub. You'll be that using all the login functions inside an Angular service. We'll explain more about that in a minute.

```javascript
var ds = deepstream('APP-URL');
```

In the HTML, the login form should look like this:
```HTML
<form ng-if="!loggedIn">
  <h3>Welcome to the chat app</h3>
  <input type="text" placeholder="email" ng-model="user.email" ng-required="true"/>
  <input type="password" placeholder="password" ng-model="user.password" ng-required="true"/>
  <button ng-click='login()'>Login</button>
</form>
```

This is inside a controller called "main", in which another controller, of the chatroom itself, would be nested.

When the button is clicked, a login function is initiated, which should look like this:

```javascript
$scope.login = function() {
  deepstreamService.login($scope.user.email, $scope.user.password)
  .then(function() {
    $scope.loggedIn = true
  })
}
```

The deepstream service will check if the user exists. If not, it initiates a signUp function that creates an HTTP POST to our deepstreamHub API. You can find out more about our HTTP API [here](/tutorials/protocols/http-endpoint). After which, the login function is immediately called, where the user's list is called. 
The function checks if the current user is in the system or not. If not the userID will be added to the list, creating a record with the email and the userId.

```javascript
userId = 'users/' + clientData.id
userEmail = email
var list = ds.record.getList('users');
list.whenReady(()=>{
  if(list.getEntries().indexOf(userId)===-1) {
    var rec = ds.record.getRecord(userId);
    rec.whenReady(()=> {
      rec.set('email', email)
      list.addEntry(userId);
      rec.discard();
    })
  }
})
```

The Angular service allows us to access the current user's details from the controllers.
This is how the full Angular deepstream service should look like in this app:

```javascript
chatApp.service('deepstreamService', function($q, $http) {
  var deepstreamService =  {}
  var userId;
  var userEmail;
  var ds = deepstream( 'wss://154.dsh.cloud?apiKey=ceb0c746-d4d5-4e1d-910e-8db2916819ea');
  function signUp(email, password) {
    $http.post(
      'https://api.dsh.cloud/api/v1/user-auth/678bd5dd-1700-4f8a-8e35-cd1552d4576c',
      {
        email : email,
        password: password
      },
      { withCredentials: true }
    )
    .then(function(response) {
      console.log('registered successfuly')
      console.log(response)
      deepstreamService.login(email, password)
    },
    function(response) {
      console.log('registered not successfully')
      console.log(response)
    });
  }

  deepstreamService.login = function(email, password) {
    return $q(function(resolve, reject) {
      ds.login({ type: 'email', email: email, password: password }, (success, clientData) => {
        if (!success) {
          signUp(email, password)
        }
        else {
          userId = 'users/' + clientData.id
          userEmail = email
          var list = ds.record.getList('users');
          list.whenReady(()=>{
            if(list.getEntries().indexOf(userId)===-1) {
              var rec = ds.record.getRecord(userId);
              rec.whenReady(()=> {
                rec.set('email', email)
                list.addEntry(userId);
                rec.discard();
              })
            }
            resolve();
          })
        }
      })
    })
  }

  deepstreamService.getDeepstream = function() {
    return ds
  }

  deepstreamService.getUser = function() {
    return {
      id: userId,
      email: userEmail
    }
  }
  return deepstreamService
})

```



## Viewing the users in your app

At this stage you have a deepstream `List` called `users` that contains the user ids of all the users in our application. From here, you will be able to:

- display all the users in your application

- start a chat with them whenever you click on a user

- have the list update in realtime whenever someone new joins

- view offline and online status and see it automatically update



Now you need to do is get the list of user ids in our application. You can do this through the `getList` method, which will return all the `Record` names in the list.

```javascript
var list = ds.record.getList('users');
```


Next you will to create a local list on the scope, this will include the user's email, as well as the id.
This is how you will create it:

```javascript
list.whenReady(()=>{
  function addUser(userId) {
    ds.record.snapshot(userId, (err, data) => {
      $scope.usersList.push({
        userId: userId,
        email: data.email
      })
      if (!$scope.$$phase) {
        $scope.$apply()
      }
    });
  }
  list.on('entry-added', addUser);
  list.getEntries().forEach(addUser);
})
```

So, as you can see, before rendering the page with the users, you iterate through the 'list.getEntries()', find the relevant record for each id, and push the email and the id as an object to the local '$scope.usersList'. Then, the list listens to new users that are added, and if such case occurs, the 'addUser' function is initiated.

This is how the chat navigation can look in the HTML:

```HTML
<div ng-controller="chats" ng-if="loggedIn">
  <div class="chatPage">
    <div class="chatNav">
      <div class="myDetails">
        <div class='currentCircle'></div>
        <h3 class="currentUser">{{myDetails.email}}</h3>
      </div>
      <div ng-repeat="user in usersList" class="users">
        <div ng-if="user.userId !== myDetails.id" ng-class="onlineUsers.indexOf(user.userId) > -1 ? 'circle' : 'notOnline'"></div>
        <button ng-class="user.userId == highlighted ? 'userLinkPressed' : 'userLink'" ng-if="user.userId !== myDetails.id"
        ng-click="selectChat(user.userId, user.email)">
        {{user.email}}
      </button>
    </div>
  </div>
  ```

  The 'ng-repeat' is iterating through the scope's usersList, and populating the users' emails. The user itself is rendered if it's not the current user (which name is at the top of the nav - 'myDetails.email'). For that we use the ng-if. It will also be highlighted when pressed, it's why we use the ng-class.
  As you can see, there's also the 'onlineUsers' div. That's a full or empty green circle next to the name, depending if the user is online/offline.
  For that we use the deepstream presence method.

  This is how to use it, to create a list on the scope of the users who are online.

  ```javascript
  ds.presence.getAll((onlineUsers) => {
    var online = [];
    onlineUsers.forEach(function(item) {
      online.push('users/' + item);
    })
    $scope.onlineUsers = online;
  })

  ds.presence.subscribe((username, online) => {
    if (online) {
      $scope.onlineUsers.push('users/' + username);
      if (!$scope.$$phase) {
        $scope.$apply()
      }
    }
    else {
      $scope.onlineUsers.splice($scope.onlineUsers.indexOf('users/' + username), 1);
      if (!$scope.$$phase) {
        $scope.$apply()
      }
    }
  })
  ```

  The 'ds.presence.getAll()' method, gets us an array of all the id's of the users who are currently online. Because it's retrieved without the initial 'users/', we add it manually to each id and then assign it to the scope as '$scope.onlineUsers'.

  Then, you need to listen for changes - users that are getting online and offline. For that we use the subscribe method. We push the username that is added to the local list if 'online==true', and remove it when it's false.   


  ## Storing the messages, populating them and chatting

  When a user presses on one of the other users, a private chat is initiated.
  A name of this unique conversation between two unique users is populated. The name is a combination of the 2 usersId, being sorted. That way, no matter who is the user who pressed on the other user, the name will be the same in each case. That would be the name of the list that holds the record names of all the messages written in this specific chat.
  This is how it happens (we will first remove the 'users/' part of the id):

  ```javascript
  var chatName = [userId.substring(6),friendId.substring(6)].sort().join('::');
  var chatList = ds.record.getList(chatName);

  ```

  When a user is writing text in the input field, and presses enter, a few things happen. First, a unique recordId is initiated. Then a record is set with this id, containing the message, email of the sender, a unique message id and the time.
  Also an entry is added to the local chatList.

  ```javascript
  $scope.submit = function() {
    var record = ds.record.getRecord(ds.getUid())
    record.whenReady(()=> {
      record.set({
        content: $scope.newMessage,
        email: $scope.user.email,
        id:userId,
        msgId: ds.getUid(),
        time: Date.now()
      })
      if (!$scope.$$phase) {
        $scope.$apply()
      }
      chatList.addEntry(record.name);
      $scope.newMessage = '';
    })
  }
  ```

  When the chat is initiated, the specific list with the unique name is retrieved. To get the message history do the same thing that you did with the list of users:


```javascript
function addChatMessage(recordName) {
  var rec = ds.record.getRecord(recordName);
  rec.whenReady(()=>{
    $scope.messages.push(rec);
    if (!$scope.$$phase) {
      $scope.$apply()
    }
  })
}

chatList.whenReady(function() {
  chatList.on('entry-added', addChatMessage);
  chatList.getEntries().forEach(addChatMessage);
})
```

  So, with 'chatList.getEntries().forEach(addChatMessage)' we get all the message history, and with 'chatList.on('entry-added', addChatMessage)' we listen when a new message is entered and push it to the local message list. That's whats creating the live chat.
  This is the HTML for the messages part looks like:

  ```html
  <div class="chatArea" ng-show="private">
    <div class="messageArea">
      <div ng-repeat="message in messages" class="messageContent">
        <h5>\{{message.get('email')}} <span class="message_timestamp">\{{message.get('time') | date:"h:mma"}}</span></h5>
        <span ng-bind="message.get('content')"></span>
      </div>
    </div>
    <div class="textArea">
      <form ng-submit="submit()">
        <input placeholder="write your message" type="text" class="input-field" ng-model="newMessage"/>
        <button type="submit" ng-show="false"></button>
      </form>
    </div>
  </div>
  ```


You can use the record get method to get the info straight from the HTML.
Now that our realtime chat application is finished, it should look as follows.

  ![Chat gif](chat-demo.gif)

  Thanks for staying with us, to get a deeper look into deepstreamHub, take a look at our other [example apps](/tutorials/#example-apps) or our various [integrations](/tutorials/#integrations).
