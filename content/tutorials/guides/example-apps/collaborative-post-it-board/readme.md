---
title: Collaborative Post-It Board
description: Creating a Retrospective Board with deepstreamHub
tags: [Javascript, lists, records]
---
With more and more teams working remotely, tools have sprung up everywhere, shifting online processes. The fun part behind retrospective planning poker and other methods was always the interactivity, seeing cards move around and identifying barely readable scribbles.
As such, let’s take a look at how we can use data-sync to create a real-time retrospective board that supports both desktops and mobile phones. It will look something like this:

![board pic](board.png)

In the spirit of agile approaches, let’s start by breaking down our requirements. Our retrospective board needs to allow us to:

- Add, edit and move cards

- Allow everyone with access to the board to see live updates

- Have a mobile friendly interface

- Add a little bit of privacy

In case you decide to make the application public, let’s throw in a few security requirements:

- Only let people access the board with a username and password

- Only let cards be edited by their creator

To achieve this, we’ll be using good old [jQuery](https://jquery.com/) on the frontend and [deepstreamHub](https://deepstreamhub.com/) as our backend.


{{> start-deepstream-server}}

## Connect to deepstream and log in

To get started, include the JS-client library

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/deepstream.io-client-js/2.1.1/deepstream.js"></script>
```

Get your app url from the dashboard and establish a connection to deepstreamHub. We'll do that, and all the login functions, inside an Angular service. We'll explain more about that in a minute.

```javascript
var ds = deepstream('APP-URL');
```


Since we want to limit users who can use the board, we are going to have to get the username and password from a minimalistic login form.

![form pic](form.png)

When a user submits their credentials, they trigger a login to the board:

```javascript
$( 'form' ).on( 'submit', function( event ){
   event.preventDefault();

var authData = {
  username: $( 'form input[type="text"]' ).val(),
  password: $( 'form input[type="password"]' ).val()
};

ds.login( authData, function( success, loginData ) {
  if( success ) {
    var isDesktop = $( window ).width() > 800;
    new Board( ds, isDesktop );
    $( 'form' ).hide();
   } else {
     $( '.login-error' ).text( loginData ).show();
   }
  });
});

```
And that’s part two. You now have your users connected and logged into deepstream!


## The juicy parts

Now comes the fun part—getting all the cards to remain in sync across all browsers/phones. Let’s take a step back and first look at data-sync and how it is used. We’ll be using [records](/tutorials/core/datasync/records/) and [lists](/tutorials/core/datasync/lists/) to keep state. A record is just a convenient way of storing and manipulating JSON with data-sync built in.
Core concepts: 

- A record has a unique identifier. You can create your own or use `getUid()`  to generate one for you: 

```javascript
const recordName = client.getUid();
const record = client.record.getRecord( recordName );
```

-You can set its data:
```javascript
record.set({
  owner: 'john'
  position: {
    left: 375,
    top: 250
  },
  content: 'This card is awesome!',
  type: 'glad'
});
```

-To get data:
```javascript
console.log( record.get( 'position.left' ))
```

-To subscribe to changes:
```javascript
record.subscribe( 'position', position => {
  console.log( 'Card moved!' )
});
```


deepstreamHub also has a concept of a “list”, which is a useful way to maintain a set of records that have things in common.  
You can `addEntry( removeName )`, `removeEntry( recordName )` and listen to entry-added and entry-removed events.
Let’s take a look at how we can put these things together to make a board. We’ll need a list to contain the set of all the records on the board. Whenever a card is created, the list will notify us and we can add it into the DOM. Since the list is the entry point to all our records, we need to use a non-random name.

```javascript
// Creating a card
function createCard() {
 const cardId = 'postits/' + this.ds.getUid();
 const card = this.ds.record.getRecord( cardId );
 card.whenReady( ( record ) => {
 record.set( properties );
 this.cardList.addEntry( cardId );
 } );
}

// Adding a card to the dom
function onCardAdded() {
 new Card( /*...*/ );
}

// Creating all the existing cards on login
this.cardList = this.ds.record.getList( 'example-board' );
this.cardList.whenReady( ( this ) => {
 const entries = this.cardList.getEntries();
 entries.forEach( onCardAdded.bind( this ) );
} );

// Listening to card being added on the board.
this.cardList.on( 'entry-added', onCardAdded );
```


That covers most of the creating of the board. The demo code on GitHub fills in all the parts I’ve not covered here, such as removing cards, and different ways you can add cards depending on your input devices.
The final requirement is dragging a card around and seeing it update on all other browsers. You can see this being done here:

```javascript
this.element
 .css( 'position', 'absolute' )
 .draggable( {
   handle: ".card-header",
   zIndex: 999,
   // Prevent jQuery draggable from updating the DOM's
   // position and leave it to the record instead.
   helper: function(){ return $( '<i></i>' ); },
   drag: ( event, ui ) => {
      this.record.set( 'position', {
       top: ui.position.top,
       left: ui.position.left
    } );
   }
 } );

this.record.subscribe( 'position', ( position ) => {
  if( position ) {
    this.element.css( {
       left: position.left,
       top: position.top
    } );
  }
}, true );
```


Note how we prevent jQuery from updating the DOM directly. This is because we are using the record as our single source of truth. By doing so, our code will process things the same way, regardless of whether the action happened remotely or locally. This is a great way to consume changes—otherwise, your code will become cluttered with unwanted conditions.
Perfect, now our board is starting to look presentable! Let’s look at adding a tiny bit of permissions now that we are familiar with the card’s JSON structure.

## Permissions

Deepstream comes with a powerful permissioning language called Valve, which can be used to create rules to allow/deny all possible client actions. Going back to our last requirement, we want to only allow the creator to update his/her own cards. Since we’ve made the username part of the recordname, this is rather straightforward. Let’s take a look at how we can implement that in our pemission.yml config file.

```javascript
record:
  "postits/.*":
  write: "data.owner === user.id"
```


And that’s it. The users who can edit cards have to be the same as the cards’ creators.
Let’s introduce a tiny bit of scope creep, and allow the scrum-master to edit any card and be the only one who can delete cards. Luckily, we added this earlier on in the user config, so we have access to user roles.

```javascript
record:
  "postits/.*":
    write: "data.owner === user.id || user.id === 'scrum-master'"
    delete: "user.data.role === 'scrum-master'"
```

And done! We now have all the bits and bobs of a real-time, authenticated and permissioned retrospective board!
