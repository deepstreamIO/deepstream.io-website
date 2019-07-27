---
title: Activity Streams / Facebook feed
description: Example app showing how to build activity streams with deepstream events
tags: [JavaScript, streams, feeds, events, pub-sub]
navLabel: Activity Streams
deepstreamVersion: 'V3'
---

With deepstream's realtime events, you can easily build an activity steam just like you see on your Facebook wall. These events are emitted as a result of an action, thereby triggering updates to all subscribed clients.

![Post Box](/images/tutorial/activity-streams/final.gif)

## Connect to deepstream and log in

Include the JS-client library

`embed: js/include-script.html`

Establish a connection to deepstream

`embed: js/create-client.js`

and log in (we didn't configure any authentication, so there are no credentials required)

```javascript
ds.login()
```

## deepstream Events

`markdown:glossary-event.md`

Events, aka Pub/Sub, allows communication using a Publish-Subscribe pattern. A client/server emits an event, which is known as publishing and all connected (subscribed) clients/servers are triggered with the event's payload if any. This is a common pattern, not just in realtime systems, but software engineering generally.

Clients and backend processes can receive events using `.subscribe()`

```javascript
ds.event.subscribe('posts-event', (eventData) => { /*do stuff*/ });
```

... and publish events using `.emit()`

```javascript
ds.event.emit('posts-event', { some: 'data' } );
```

## Creating Posts
The mechanism for creating posts is simple. We need a textarea to collect the post content and a button to trigger an action:

```html
<div class="post__image" id="post-image">
                    
</div>
<div class="post__text">
    <textarea name="" id="post-content" rows="3">What's on your mind?</textarea>
</div>
<div class="post__control">
    <button id="post-button">Post</button>
</div>
```

The `#post-image` div will be updated with the avatar of the user posting. For simplicity, these avatar images will be fetched using the [Random User](https://randomuser.me/) API.

Let's quickly fetch the random user on page load:

```js
let user = {};
$.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
        user = data.results[0];
        $('#post-image').append(`<img src="${user.picture.medium}" />`)
    }
});
```

We have a global `user` object which we update with the data from Random User API. We also update the new post box avatar so we can visually tell who is posting:

![Post Box](/images/tutorial/activity-streams/post-box.png)

When the post content is filled and the post button clicked, we expect to emit an event with this post content and the user we just received as the event payload:

```js
$('#post-button').click(_ => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];

    if(user.name) {
        ds.event.emit('posts-event', {
            content: $('#post-content').val(),
            name: user.name.first + ' ' + user.name.last,
            picture: user.picture.medium,
            time: time
        });
    }
});
```

The event object is available on the deepstream instance, `ds`. We use this to emit a `posts-event` event which also has a payload object that the subscribed clients can consume.

## Updating Post Streams

Now that we are publishing information, we need clients to listen and subscribe to these information. This can still be done via the event object on the deepstream instance:

```html
<div class="cards" id="cards"></div>
```

```js
ds.event.subscribe('posts-event', data => {
    const html = `
        <div class="card new_card">
            <div class="card__header">
                <div class="card__image">
                    <img src="${data.picture}" alt="" />
                </div>
                <div class="card__name-time">
                    <h4 class="card__name">${data.name}</h4>
                    <div class="card__time">${data.time}</div>
                </div>
            </div>
            <div class="card__content">
                ${data.content}
            </div>
        </div>
    `;
    $('#cards').prepend(html);
})
```

The `subscribe` method takes a callback, and this callback receives the payload as parameter. We then build a markup with this payload and inject the markup into our DOM.

## Visual Feedback

Notice that the cards markup parent element has `new_card` class. This card helps give a visual feedback to the user by flashing a blue background on the new post. The animation is basic and with CSS keyframes:

```css
.new_card {
  animation-name: newPost;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
  animation-duration: 1s;
}

@keyframes newPost {
  0% {
    background: #fff;
  }
  50% {
    background: #C3D0E9;
    color: #fff;
  }
  100% {
    background: #fff;
  }
}
```

## More Examples
We at deepstream have built and are building a lot of awesome example apps like the one we have just seen. You can checkout the [Realtime Todo List](/tutorials/example-apps/realtime-todo-list/), [Android Chat App](/tutorials/example-apps/android-chat-app/), [and more...](/tutorials/#example-apps)
