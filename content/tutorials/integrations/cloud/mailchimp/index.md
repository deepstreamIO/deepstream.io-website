---
title: Mailchimp
description: How to integrate deepstream with Mailchimp
tags: [Vue, Mailchimp, Events, Pub/Sub]
logoImage: mailchimp.png
---
To effectively manage customers, you need proper customer care and customer engagement. This is possible through any media means but more powerful when you have your customers' contacts (most especially emails). 

Managing these contacts and creating marketing campaigns is not always as easy as it theoretically seems. For this reason, the responsibility is handed over to tools like Mailchimp so we could have more time for the actual business goal.

Mailchimp makes it easy to manage subscribers and create marketing campaigns. With deepstream, you can monitor these activities in realtime. 

A good example: you might be interested in updating all connected admin/marketers dashboard with a new email subscription. Your intention could be for a customer service agent to follow up with the new customer or perform other actions based on this new subscription.

This article will show you how to seamlessly integrate Mailchimp with deepstream and announce new email subscriptions in realtime.

![](/assets/img/tutorial/mailchimp-integration/final.gif)

[Getting started with deepstream is easy](/tutorials/getting-started/javascript) and takes less than ten minutes. However, if you have any questions, please [get in touch](/contact).


{{> start-deepstream-server}}

Setting up deepstream is easy: 

- [Sign up](https://dashboard.deepstream.com/signup/) for free 

- Create a new app or select an existing [app from your dashboard](https://dashboard.deepstream.com/#/dashboard)
- Copy and store the connection URL

## Setup Mailchimp Contact List

- Create a [Mailchimp account](https://login.mailchimp.com/signup)
- Create a contact [list from your dashboard](https://us9.admin.mailchimp.com/lists/)

![Create List Image](/assets/img/tutorial/mailchimp-integration/create-list.png)

- Generate an [API key](https://us9.admin.mailchimp.com/account/api/) for API authentication

## deepstream Events
Before we dive deep, it's important to understand what deepstream feature we will be making use of.

{{> glossary event=true noHeadline=true}}



Events, aka Pub/Sub, allows communication using a Publish-Subscribe pattern. A client/server emits an event, which is known as publishing and all connected (subscribed) clients/servers are triggered with the event's payload if any. This is a common pattern, not just in realtime systems, but software engineering generally.

Clients and backend processes can receive events using `.subscribe()`

```javascript
ds.event.subscribe( 'posts-event', function( eventData ){ /*do stuff*/ });
```

... and publish events using `.emit()`

```javascript
ds.event.emit( 'posts-event', {some: 'data'} );
```

## App Setup
Now that the chores are settled, we can start building our example app.

The example app will be a web application with Node + Express for API and Vue for the UI. 

The API will be responsible for handling Mailchimp tasks and emitting a new email subscriber event using deepstream events while the UI will display subscribers and subscription form.

Let's create a new Express project:

```bash
# 1. Install Express generator
npm install express-generator -g
# 2. Create Express app with generator
express --view=ejs ds-mailchimp
# 3. Install dependencies
cd ds-mailchimp && npm install
```

The above commands will bootstrap Express and install boilerplate dependencies for you.  You also need to install deepstream client as well as `request` for making HTTP calls to the Mailchimp API:

```bash
# Install deepstream and request
npm install @deepstream/client request
```

## Subscribe and Subscribers Routes

We just need to add two endpoints to the express app, `/subscribe` and `/subscribers`. 

`/subscribe` will add new subscribers to the Mailchimp list, while `/subscribers` will list all subscribers in the list.

Before creating these routes, we need to import and configure `deepstream` and `request`. We also need to create a config object that stores our Mailchimp credentials.

```js
// ./routes/index.js
const request = require('request');
const deepstream = require('@deepstream/client');

const dsClient = deepstream('<DEEPSTREAM-APP-URL>').login()

const mailchimpConfig = {
  listId: '<LIST-ID>',
  username: 'anystring',
  key: '<MAILCHIMP-API-KEY>'
}
```

Calling the `login` method on the deepstream instance opens up a connection to deepstream. The `<>` placeholders should hold the credentials you received and stored from deepstream and Mailchimp while setting up free accounts.

The list id can be retrieved from the list's settings page:

![List ID](/assets/img/tutorial/mailchimp-integration/list-id.png)

Now let's take a look at the `/subscribe` route:

```js
// ./routes/index.js
router.post('/subscribe', function(req, res) {
  const requestBody = req.body;
  const memberArray = [];
  memberArray.push(requestBody)
  
  const members = JSON.stringify({members: memberArray})

  request.post({url:`https://us9.api.mailchimp.com/3.0/lists/${mailchimpConfig.listId}`, form: members}, ( err, httpResponse, body ) => {
    dsClient.event.emit('subscribe', JSON.parse(body))
    res.send( JSON.parse(body) )
  }).auth(mailchimpConfig.username, mailchimpConfig.key);
})
```

The payload gets assembled for the API by converting it into a JSON string. That is the only format that Mailchimp allows.

We use `request`'s `post` method to send the payload to the API sever while passing the auth credentials in the chained `auth` method.

When the request completes, we use deepstream to emit a `subscribe` event with the parsed response as payload.

The `/subscribers` route is simpler because we are just requesting for existing contact lists:

```js
// ./routes/index.js
router.get('/subscribers', function(req, res) {
  request.get({url:`https://us9.api.mailchimp.com/3.0/lists/${mailchimpConfig.listId}/members`}, ( err, httpResponse, body ) => {
    res.send( JSON.parse(body) )
  }).auth(mailchimpConfig.username, mailchimpConfig.key);
})
```

## Vue Routes
Enter the Vue UI app. 

Before we start creating these Vue routes, let's include Vue and other supporting libraries to the `index.ejs` file:

```html
<html>
  <body>
   
     ...
  <!-- deepstream client -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/@deepstream/client/2.1.2/deepstream.js"></script>
  <!-- Axios for HTTP requests -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
   <!-- Vue core library -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
   <!-- Vur router library -->
  <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
   <!-- Custom JS -->
  <script src="/javascripts/script.js"></script>
  </body>
</html>

```

We need two routes: one (`/`) to show all the list of subscribers and another (`/subscribe`) to hold the subscription form. 

```js
// ./public/javascripts/script.js
const App = {
    template: '#main'
}

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/subscribe',
            component: Subscribe
        }
    ]
})

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
```

The Vue instance is mounted on a div with an id `app`:

```html
<!--./views/index.ejs-->
<div id="app"></div>
```
It also uses the `App` component as it's entry component. `App` uses a `script` template of type `text/x-template` with a `main` ID. The template is responsible for mounting the router view, displaying the app header as well as route links:

```html
<!--./views/index.ejs-->
<script type="text/x-template" id="main">
  <div>
    <h1 class="text-center">Cheerful Subscribers</h1>
    <div class="link">
      <router-link to="/subscribe"><span class="glyphicon glyphicon-envelope"></span> Subscribe</router-link>
      <router-link to="/"><span class="glyphicon glyphicon-home"></span> Home</router-link>
    </div>
    <router-view></router-view>
  </div>
</script>
```

## Listing Subscribers

The `Home` component which is mounted on the `/` route is responsible for displaying the list of existing subscribers.

```js
// ./public/javascripts/script.js
const Home = { 
    template: '#home',
    created () {
        
        const dsClient = deepstream('<APP-URL>').login()
        // subscribe to the "subscribe" event
        // This event is emitted from from our
        // backend route
        dsClient.event.subscribe('subscribe', (payload) => {
            console.log(payload.new_members[0].email_address)
            this.subscribers.push(payload.new_members[0])
        })

        this.fetchSubscribers();
        
    },
    data () {
        return {
            subscribers: []
        }
    },
    methods: {
        `() {
            axios.get('/subscribers').then((response) => {
                this.subscribers = response.data.members;
            })
        },
    }
}
```

A `subscribers` model is created in the data function. This model is set to the list of subscribers using `fetchSubscribers` which employs `axios` to make a HTTP request. `fetchSubscribers` is called once the component is ready using the `created` lifecycle hook.

Apart from making a request when the component loads, the `created` hook also listens to the deepstream event that was emitted in the backend route. If anything comes in, it will push the data to the existing `subscribers` list model.

The subscribers are rendered by iterating over the `subscribers` array and displaying their email addresses:

```html
<!--./views/index.ejs-->
<script type="text/x-template" id="home">
  <div class="cards">
    <div class="col-md-3" v-for="sub in subscribers">
      <div class="card new-card">
        {{sub.email_address}}
      </div>
    </div>
  </div>
</script>
```

![List of subscribers](/assets/img/tutorial/mailchimp-integration/list.png)

## Creating Subscribers
The `Subscribe` component mounted on `/subscribe` route is responsible for using a form to collect email addresses and subscribe them to the Mailchimp list:

```js
// ./public/javascripts/script.js
const Subscribe = { 
        template: '#subscribe',
    data () {
        return {
            model: {
                email_address: '',
                status: 'subscribed'
            }
        }
    },
    methods: {
        subscribe() {
            axios.post('/subscribe', this.model).then((response) => {
                this.$router.push('/')
            })
        }
    }
}
```

The form values are collected using `v-model`. When the form is submitted, `subscribe` method is called to handle the submission. This method uses `axios` as well to make a POST request and, if it's successful, redirects to the Home page.

This is what the form looks like:

```html
<!--./views/index.ejs-->
<script type="text/x-template" id="subscribe">
      <div class="col-md-6 col-md-offset-3">
        <div class="card form">
          <form @submit.prevent="subscribe">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" v-model="model.email_address">
            </div>
            <button class="button">Subscribe</button>
          </form>
        </div>
      </div>
    </script>
```

![Subscription Form](/assets/img/tutorial/mailchimp-integration/form.png)

## Final Notes
- deepstream events can be setup both on the client side of your app as well as the server side. In such cases, both will still communicate effectively.
- Demo: https://ds-mailchimp-demo.herokuapp.com
