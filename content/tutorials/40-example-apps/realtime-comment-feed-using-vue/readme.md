---
title: Realtime Comment Feed
description: Learn how to create a realtime comment feeds with authentication using Vue
tags: [Javascript, Vue, lists, records]
navLabel: Comment Feed using Vue
draft: true
---
This walkthrough covers the fundamentals of what it takes to build a realtime comment feed application. Therefore, if you desire to add a feature like Facebook-style comments in your next app, then this is definitely what you need to read.

This article is built with Vue and covers the following significant topics:

- Realtime authentication with deepstream
- Realtime data store with deepstream
- Vue routing
- Component composition
- Managing state with Vue's custom events

This article assumes a prior knowledge of [Vue basics](https://vuejs.org/v2/guide/).

## Setup & Tooling
Vue is trivial to get started with. This is as a result of the Vue CLI tool which gives you the power to seamlessly create new projects without the tooling drama. To embark on our realtime journey, we need to first install this CLI tool and then use the tool to create a new Vue project:

```bash
# 1. Install CLI tool
npm install -g vue-cli

# 2. Create a new project
vue init webpack comment-feeds

# 3. Enter project directory via command line
cd comment-feeds

# 4. Install npm dependencies for project
npm install

# 5. Install deepstream and other utility libraries
npm install --save @deepstream/client axios blueimp-md5
```

At step 2, where you initialize a new project, answer the questions with the following answers:

![Installation CMD](/images/tutorial/vue-comment-feeds/installation.png)

## Simple Vue Routes
In as much as we are making a "single page app", we need to create different views to take care of different tasks like authentication and displaying/creating comment feeds.

Vue's route engine simplifies single page app routing. It was included during the installation, therefore there is no need to install. We just need to set it up:

```js
// ./src/main.js

import Vue from 'vue';
import App from './App';
// Import router
import router from './router';


/* eslint-disable no-new */
new Vue({
  el: '#app',
  // Initialize Vue with route configurations
  router,
  template: '<App/>',
  components: { App },
});
```

Let's take another important step to create the router configurations:

```js
// ./src/router/index.js

import Vue from 'vue';
// Import Vue Router
import Router from 'vue-router';

// Import route pages
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';

// Tell Vue to make use of this Router
Vue.use(Router);

// Configure and export routes
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Home,
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
  ],
});
```

Now that we have the routes configured, we can gradually start making our pages. The app will keep throwing errors because the imports do not exist. Therefore, if you are building along, you might want to comment out the routes and imports then add them back while we create them.

We need to update the `App.vue` entry component to add `router-vue` which is where the route views will be mounted and `router-link` for navigating around routes:

```html
<!--Navigation-->
<ul class="nav navbar-nav navbar-right">
   <template v-if="authUser && authUser.email">
     <li><router-link to="#"><img :src="authUser.avatar" alt="Avatar" class="img-responsive avatar"> \{{ authUser.name || authUser.email \}}</router-link></li>
     <li><a href="#" @click="handleSignOut">Sign Out</a></li>
   </template>
   <template v-else>
     <li><router-link to="/sign-in">Sign In</router-link></li>
     <li><router-link to="/sign-up">Sign Up</router-link></li>
   </template>
 </ul>
<!--Router view-->
<router-view></router-view>
```

The `authUser` variable will be explained in details in a later topic.

## Authentication with deepstream

deepstream authentication is stateless. This implies that just like REST, you have to authenticate every realtime activity. It doesn't mean you have to provide credentials, you can perform anonymous auth.

Our example needs identity management to know who is making a comment. For this reason, we can't just use deepstream's anonymous auth. We will need to use email and password authentication. Let's get started by creating a user using a sign up form.

## Signing Up

deepstream users' signup API endpoint allows you to create users and store on the deepstream server. With that, you can authenticate using email and password for existing users.

![IMAGE OF SIGNUP PAGE](/images/tutorial/vue-comment-feeds/signup.png)

Let's create the Vue file for sign up to match the route we defined initially:

```html
<!-- ./src/pages/SignUp.vue -->

<template>
  <div class="container">
    <div class="col-md-6 col-md-offset-3 sign-up">
      <h3>Sign Up</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" v-model="model.email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="model.password">
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" class="form-control" v-model="model.name">
        </div>
        <div class="form-group">
          <button>
            Join
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import md5 from 'blueimp-md5';
  import * as ds from '@deepstream/client';

  export default {
    name: 'sign-up',
    data() {
      return {
        model: {
          name: '',
          email: '',
          password: '',
          avatar: '',
        },
        ds: ds('<APP_URL>'),
      };
    },
   
    methods: {
      // coming soon
    }
  };
</script>


<style scoped>
  /* truncated */
</style>
```

Vue files allow you to define markup (HTML),  logic (JS) and styles (CSS) in a single file which is fantastic. The markup is comprised of a basic form for collecting a user's basic information. When it is submitted, a component `handleSubmit` is expected to handle it.

The JavaScript section just imports few helper libraries and creates a component skeleton with our form model data as well as deepstream initialization. We will see what axios and md5 imports will help us do in a moment.

### Handling Signup

The `handleSubmit` method which the form invokes is where the user's signup journey begins. The flow for this example is as follows:

1. Submit user credentials via a form.
2. Attempt login first. If successful, it means the user exists, so just log them in and store their credentials in localStorage:

    ```js
    ...
    import { set } from '@/services/localStorage';
    import { $emit } from '@/services/eventHub';

    export default {
        name: 'sign-up',
        data() {
          ...
        },
      
        methods: {
          handleSubmit() {
            this.model.avatar = `https://s.gravatar.com/avatar/${md5(this.model.email.trim().toLowerCase())}?s=200.jpg`;

            this.ds.login({
              type: 'email',
              email: this.model.email,
              password: this.model.password,
            }, (success) => {
              if (!success) {
                this.createUser();
              } else {
                set('ds:cred', this.model);
                $emit('auth:signIn', this.model);
                this.$router.push('/');
              }
            });
          }
        }
      };
    ```
    The form does not contain an input for avatar. Rather, we use [Gravatar](https://gravatar.com) by creating an md5 hash of the user's email. This is Gravatar's API requirement.

    If login is NOT successful, we call the `createUser` method which will be handled in the __#3__. Otherwise, we use a localStorage service to persist the credentials:

    ```js
    // ./src/services/localStorage.js
    export const set = (name, data) => {
      window.localStorage.setItem(name, JSON.stringify(data));
    };

    export const get = (name) => {
      const item = window.localStorage.getItem(name);
      if (!item) {
        window.localStorage.setItem(name, JSON.stringify({}));
      }
      return JSON.parse(item);
    };

    export const remove = (name) => {
      window.localStorage.removeItem(name);
    };
    ```

    > __WARNING__:
    >
    > I am only using localStorage for the purpose of this example. You must NEVER store user's email and password credentials in localStorage. 
    >
    >What you can do is have a server that [generates a token](/tutorials/guides/jwt-auth/) for you which you can store as a cookie. 
    >
    >deepstream allows you to use [webhook authentication](/tutorials/guides/http-webhook-auth) in achieving such flow.

    An event is also emitted to tell the rest of our app that are interested in the new state change.

    The `eventHub` service is handy for making inter-component communication. This example app is simple enough not to use a state management tool. Dispatching and listening to component events are just enough. This is what the hub looks like:

    ```js
    // ./src/services/eventHub.js
    import Vue from 'vue';

    const vm = new Vue();

    export const $on = (name, cb) => {
      vm.$on(name, cb);
    };

    export const $emit = (name, payload) => {
      vm.$emit(name, payload);
    };
    ```

3. If not successful, make a post request to the `user-signup` endpoint to create a new user.
4. Log user in when sign-up post request is complete successfully

    ```js
    export default {
      name: 'sign-up',
      data() {
        ...
      },
      
      methods: {
          ...
          createUser() {
            const authUrl = 'https://api.deepstream.com/api/v1/user-auth/signup/<API-KEY>';
            axios.post(authUrl, {
              type: 'email',
              email: this.model.email,
              password: this.model.password,
            }).then(({ data }) => {
              // Attempt to re-login
              this.ds.login({
                type: 'email',
                email: this.model.email,
                password: this.model.password,
              }, () => {
                set('ds:cred', this.model);
                $emit('auth:signIn', this.model);
                this.addUserToRecords(data.id);
              });
            });
          },
      }
    };
    ```
    We use [axios](https://github.com/mzabriskie/axios) which is a promise-based HTTP utility library to make a post request to the deepstream server. If user is successfully created from the request, we attempt another login with the credentials.

    The `addUserToRecords` method will be explained in __#5__.

5. Create a `user` record to store the user's credential

The user signup endpoint allows only email and password. What happens to the name of the user and her avatar? We can create a record in deepstream to store that. 

`markdown:glossary-record.md`


The ID of the record will be the same with the user's auth ID so we can easily fish the record when a user logs in:

```js
export default {
   name: 'sign-up',
   data() {
     ...
   },
  
   methods: {
      ...
      addUserToRecords(userId) {
        this.users = this.ds.record.getList('users');
        this.users.whenReady(() => {
          const user = this.ds.record.getRecord(`user/${userId}`);
          user.whenReady(() => {
            user.set(Object.assign({}, this.model, { id: userId }));
            this.users.addEntry(user.name);
            this.$router.push('/');
          });
        });
      },
   }
 };
```

First, we create/retrieve deepstream list to hold a collection of user records using `getList`. This is not a synchronous task, so the `whenReady` method tells us when it is completed. Once we have the list, we can create the record using `getRecord` and set its value with our form data using `set`.


## Signing In

![Sign in](/images/tutorial/vue-comment-feeds/signin.png)

The sign in flow is a lot simpler than what we had for sign up. We just need to call the deepstream `login` method, pass in the credentials provided, and if successful, store in localStorage:

```html
<!-- ./src/pages/SignIn.vue -->
<template>
  <div class="container">
    <div class="col-md-6 col-md-offset-3 sign-in">
      <h3>Sign In</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" v-model="model.email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="model.password">
        </div>
        <div class="form-group">
          <button>
            Enter
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import * as ds from '@deepstream/client';
  import { set } from '@/services/localStorage';
  import { $emit } from '@/services/eventHub';

  export default {
    data() {
      return {
        model: {
          email: '',
          password: '',
        },
        ds: ds('<API-URL>'),
      };
    },
    created() {

    },
    methods: {
      handleSubmit() {
        this.ds.login({
          type: 'email',
          email: this.model.email,
          password: this.model.password,
        }, (success, data) => {
          if (!success) {
            // User does not have an account,
            // let her sign in
            this.$router.push('/sign-up');
          } else {
            const user = this.ds.record.getRecord(`user/${data.id}`);
            user.whenReady(() => {
              // Store in localStorage
              set('ds:cred', user.get());
              // Emit auth event
              $emit('auth:signIn', user.get());
              // Go home
              this.$router.push('/');
            });
          }
        });
      },
    },
  };
</script>

<style scoped>
  /*...*/
</style>
```

If you followed the sign-up process, then the sign in should be pretty straight-forward.

## Navigation Bar Auth Status
A common trend in the web community is to add a user's name on the navigation bar if they are authenticated or show the auth buttons (sign in and sign up) if they are not. Let's utilize the events we have been emitting in the auth components to update the nav bar from the `App` component which houses the `router-view` and the nav bar:

```html
<!-- ./src/App.vue -->
<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            <!--SVG icon here-->
          </a>
        </div>
        <ul class="nav navbar-nav navbar-right">
          <template v-if="authUser && authUser.email">
            <li><router-link to="#"><img :src="authUser.avatar" alt="Avatar" class="img-responsive avatar"> \{{ authUser.name || authUser.email \}}</router-link></li>
            <li><a href="#" @click="handleSignOut">Sign Out</a></li>
          </template>
          <template v-else>
            <li><router-link to="/sign-in">Sign In</router-link></li>
            <li><router-link to="/sign-up">Sign Up</router-link></li>
          </template>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import * as ds from '@deepstream/client';
  import { $on, $emit } from '@/services/eventHub';

  import { get, remove } from './services/localStorage';

  export default {
    name: 'app',
    data() {
      return {
        authUser: {},
      };
    },
    created() {
      this.authUser = get('ds:cred');

      $on('auth:signOut', () => {
        this.authUser = {};
      });

      $on('auth:signIn', (data) => {
        this.authUser = data;
      });
    },
    methods: {
      handleSignOut() {
        remove('ds:cred');
        $emit('auth:signOut');
        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style>
 /* ... */
</style>
```

`authData` is bound to the nav bar. We listen to the `auth` events and update the `authData` accordingly using the event payload.

There is also a sign out method which empties the store.

Now that we know who is using our app at a given time let's build the comment feeds.

## Comment Feeds Container
A common pattern in building web components is to divide them into functional parts -- presentation and container. 

Presentation components just receive data (without knowledge of how it came about) and render them to the browser. Container components negotiate for data and pass them down to the presentation component. 

If there is a need for the presentation component to notify containers about change, they can do that with component events.

The container component for our comment feeds is actually the Home page. Let's create that:

```html
<!-- ./src/pages/Home.vue -->
<template>
  <div class="main">
    <div class="container">
      <div class="col-md-6 col-md-offset-3">
        <comment-list :comments="comments"></comment-list>
      </div>
    </div>
    <comment-form @submit-comment="handleNewComment"></comment-form>
  </div>
</template>

<script>
import * as ds from '@deepstream/client';
import { get } from '@/services/localStorage';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default {
  name: 'home',
  data() {
    return {
      comments: [],
      ds: ds('<Your deepstream URL>'),
    };
  },
  created() {
    
  },
  methods: {
    
  },
  components: {
    CommentList,
    CommentForm,
  },
};
</script>

<style scoped>
/* ... */
</style>
```

The components are dependent on two other presentation components -- Comment Form and Comment List. Comment List expects a list of comments to be passed down to it while Comment Form will be emitting a `handleNewComment` event for the Home component to handle writing this new record.

Le's begin by handling `handleNewComment`:

```js
import * as ds from '@deepstream/client';
import { get } from '@/services/localStorage';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default {
  name: 'home',
  data() {
    return {
      comments: [],
      ds: ds('wss://154.deepstream.com?apiKey=68b9dab4-e3ea-4987-b6ed-b3c7c83b7c4a'),
    };
  },
  created() {
    this.auth = get('ds:cred');
    if (!this.auth || !this.auth.email) this.$router.push('/sign-in');

    this.ds.login({
      email: this.auth.email,
      password: this.auth.password,
    });
    
    this.commentsList = this.ds.record.getList('comments');
    
  },
  methods: {
    handleNewComment(comment) {
      const commentRecord = this.ds.record.getRecord(`comment/${this.auth.id}/${this.ds.getUid()}`);
      commentRecord.whenReady(() => {
        commentRecord.set(comment);
        this.commentsList.addEntry(commentRecord.name);
      });
    },
  },
  components: {
    CommentList,
    CommentForm,
  },
};
```

The `created` method is a lifecycle hook that is executed once the component is ready. This makes it a good place to run some check and execute some bootstrap code.

In this case, we first check a user is authenticated by looking in the localStorage for her email. If she is, we log her into deepstream with the credentials, but if she isn't, we redirect her to the sign in page.

`handleNewComment` receives a comment payload which it uses the auth ID as a reference to create a new record. Once this record is created, it is added as an entry to the `comments` list.

Note we have a `comments` array that is bound to the view. This array will be populated in two ways:

- When the app loads buy and
- When a new record is added is added to the deepstream `comments` list.

Still, in the `created` hook, let's implement the above-listed ways:

```js
created() {
    this.auth = get('ds:cred');
    if (!this.auth || !this.auth.email) this.$router.push('/sign-in');

    this.ds.login({
      email: this.auth.email,
      password: this.auth.password,
    });

    this.commentsList = this.ds.record.getList('comments');

    this.commentsList.whenReady(() => {
      this.commentsList.getEntries().reverse().forEach((v) => {
        this.getListEntryRecord(v);
      });

      this.commentsList.on('entry-added', (entry) => {
        this.getListEntryRecord(entry);
      });
    });
  },
```

When the list is ready, we ask deepstream to fetch all entries, loop through them and call `getListEntryRecord` on each item. We will have a look at `getListEntryRecord` shortly.

We also attach a listener to `entry-added` so when we call `addEntry` from `handleNewComment` method, the event is triggered with the new entry. We still call `getListEntryRecord` to handle that.

Now let's see what `getListEntryRecord` looks like:

```js
methods: {
    /*...*/
    getListEntryRecord(entry) {
      const commentRecord = this.ds.record.getRecord(entry);
      commentRecord.whenReady(() => {
        this.comments.unshift(commentRecord.get());
      });
    },
  },
```

deepstream's lists hold the record name not the actual values of the record. For this reason, we have to use the record name to retrieve each of the record's values.

## Comment List Component
Comment List Component is a presentation component. This makes it very simple, because it just receives data from the parent component and renders using the template:

```html
<!-- ./src/components/CommentList.vue -->
<template>
  <div class="row comment-list">
    <template v-for="comment in comments">
      <comment-box :comment="comment"></comment-box>
    </template>
  </div>
</template>

<script>
  import CommentBox from './CommentBox';

  export default {
    name: 'comment-list',
    props: ['comments'],
    data() {
      return {

      };
    },
    components: {
      CommentBox,
    },
  };
</script>

<style scoped>
 /* ... */
</style>
```

`comments` is passed down with the help of the `props` property on the component. We iterate over the array passed down and used another presentation component to render each of the comments.

## Comment Box Component

Comment Box Component is simpler than the above. It receives an object from the the parent component which is Component List. This object is a single item from the `comments` array:

```html
<!-- ./src/components/CommentBox.vue -->
<template>
  <div class="comment-box row">
    <div class="col-md-1">
      <img :src="comment.avatar" alt="" class="img-responsive">
    </div>
    <div class="col-md-10">
      <h4>{{comment.name}}</h4>
      <p>{{comment.text}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'comment-box',
    props: ['comment'],
    data() {
      return {

      };
    },
  };
</script>

<style scoped>

  /*...*/

</style>

```

## Comment Form Component

One last presentation component to take a look at is the one that renders the form. It takes a form template and displays it. Handling is done by the Home component by emitting Vue's component events:

```html
<!-- ./src/components/CommentForm.vue -->
<template>
  <div class="comment-form row">
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <input type="text" class="form-control" v-model="model.text">
      </div>
    </form>
  </div>
</template>

<script>
  import { get } from '@/services/localStorage';

  export default {
    name: 'comment-form',
    data() {
      return {
        model: {
          text: '',
        },
      };
    },
    created() {
      this.auth = get('ds:cred');
    },
    methods: {
      submitComment() {
        const comment = Object.assign({}, this.model, this.auth);
        this.$emit('submit-comment', comment);
      },
    },
  };
</script>

<style scoped>
    /*...*/
</style>
```

![Home](/images/tutorial/vue-comment-feeds/home.png)

There is a little bit of redundancy because we are creating comments with existing user information added to it. This is not so bad, because it's more expensive to retrieve both nodes differently.

## Conclusion
It's exciting to see how deepstream blends into whatever environment your app is meant to live in. Just as it's easy to work with Vue and deepstream, you can also integrate with any other frontend tool including Angular, React, Ember, etc. 

deepstream can also live in your server application. The JS library can be used in a Node environment. There are native SDKs available for your use and more to come. These include Java, Swift, etc.
