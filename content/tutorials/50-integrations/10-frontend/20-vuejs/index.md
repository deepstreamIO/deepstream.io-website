---
title: VueJS
description: Learn how to add realtime features to your VueJS webapp and start using our realtime database in the browser.
logoImage: vuejs.png
tags: [JavaScript, VueJS, Vue, data-sync, pub-sub, request-response, RPCs]
wip: true
---

This getting started guide will walk you through integrating deepstream in Vue. You will also learn how to implement the three deepstream core concepts: [Records](/tutorials/core/datasync/records/), [Events](/tutorials/core/pubsub/) and [RPCs](/tutorials/core/request-response/).

deepstream provides a JavaScript library which helps interact with your deepstream server.

## Create a Vue App

Vue provides a nice CLI tool for creating and managing Vue apps. The CLI allows you to create Vue apps using different templates that use either Webpack, Browserify or just CDN scripts. This example will use the `simple` template which creates Vue app with the CDN scripts:

```bash
# Install Vue CLI
npm install -g vue-cli
# Create Vue app with "simple" template
vue init simple ds-vue
```

## Connect to deepstream and log in

After you have successfully created a Vue app, add the deepstream JS-client library in your new project:

```html
<script src="https://cdn.deepstream.io/js/client/latest/ds.min.js"></script>
```

Get your app url from the dashboard and establish a connection to deepstream using the `created` lifecycle hook:

```javascript
new Vue({
    el: '#app',
    data: {
        ds: null,
    },
    created: function() {
        this.ds = new DeepstreamClient('localhost:6020')
        .login()
    }
})
```


The hook will connect to your deepstream server and login only when the component is created.


## Records (realtime datastore)
`markdown:glossary-record.md`

Creating a new record or retrieving an existent one works the same way

```javascript
const myRecord = ds.record.getRecord( 'test/johndoe' );
```

Values can be stored using the `.set()` method

```javascript
myRecord.set({
    firstname: 'John',
    lastname: 'Doe'
});
```

Let's set up two-way bindings with an input field - whenever a path within our record, e.g. `firstname` changes we want to update the input. Whenever a user types, we want to update the record.

![Two-way realtime bindings](/images/tutorial/browser-app/realtime-datastore.gif)

Let's see an example:

```javascript
const Record = {
    template: `
        	<div class="group realtimedb">
                <h2>Realtime Datastore</h2>
                <div class="input-group half left">
                    <label>Firstname</label>
                    <input type="text" v-model="firstname" @input="handleFNameUpdate()" />
                </div>
                <div class="input-group half">
                    <label>Lastname</label>
                    <input type="text" v-model="lastname" @input="handleLNameUpdate()" />
                </div>
            </div>
    `,
    props: ['ds'],
    data: function() {
        return {
            firstname: '',
            lastname: '',
        }
    },
    created: function() {
        this.record = this.ds.record.getRecord('test/johndoe');
        
        this.record.subscribe(values => {
            this.firstname = values.firstname;
            this.lastname = values.lastname;
        })
    },
    methods: {
        handleFNameUpdate: function() {
            this.record.set('firstname', this.firstname);
        },
        handleLNameUpdate: function() {
            this.record.set('lastname', this.lastname);
        }
    }
};
```

The `ds` props is the deepstream connection instance which is passed from the parent `App` component to the child `Record` component.

The `subscribe` method is used to listen for updates and update the inputs accordingly. The method is called in the `created` lifecycle hook as well so it can be setup once the component is created.

## Events (publish-subscribe)
`markdown:glossary-event.md`

![Publish-Subscribe](/images/tutorial/browser-app/pubsub.gif)

Clients and backend processes can receive events using `.subscribe()`

```javascript
ds.event.subscribe( 'test-event', function( eventData ){ /*do stuff*/ });
```

... and publish events using `.emit()`

```javascript
ds.event.emit( 'test-event', {some: 'data'} );
```

A simple example:

```javascript
const Events = {
    template: `
        	<div class="group pubsub">
                <div class="half left">
                    <h2>Publish</h2>
                    <button class="half left" id="send-event" @click="handleClick()">Send test-event with</button>
                    <input type="text" class="half" id="event-data" v-model="value"/>
                </div>
                <div class="half">
                    <h2>Subscribe</h2>
                    <ul id="events-received">
                        <template v-for="event in eventsReceived">
                            <li> {{event}} </li>
                        </template>
                    </ul>
                </div>
            </div>
    `,
    props: ['ds'],
    data: function() {
        return {
            eventsReceived: [],
            value: '',
        };
    },
    created: function() {
        this.event = this.ds.event;
        this.event.subscribe('test-event', value => {
            this.eventsReceived.push(value);
        });
    },
    methods: {
        handleClick: function() {
            this.event.emit('test-event', this.value)
        }
    }
};
```

Just like the `record` example, `ds` instance is passed as props and the `created` hook handles the event subscription.

## RPCs (request-response)

`markdown:glossary-rpc.md`

![Request Response](/images/tutorial/browser-app/request-response.gif)

You can make a request using `.make()`

```javascript
ds.rpc.make( 'multiply-numbers', { a: 6, b: 7 }, function( err, result ){
    //result === 42
});
```

and answer it using `.provide()`

```javascript
ds.rpc.provide( 'multiply-numbers', function( data, response ){
    resp.send( data.a * data.b );
});
```

For example:

```javascript
const RPC = {
    template: `
        	<div class="group reqres">
                <div class="half left">
                    <h2>Request</h2>
                    <button class="half left" @click="handleClick()">Make multiply request</button>
                    <div class="half">
                        <input type="text" v-model="requestValue" class="half left" />
                        <span class="response half item"> {{displayResponse}} </span>
                    </div>
                </div>
                <div class="half">
                    <h2>Response</h2>
                    <div class="half left item">Multiply number with:</div>
                    <input type="text" class="half" v-model="responseValue" />
                </div>
            </div>
    `,
    props: ['ds'],
    data: function() {
        return {
            responseValue: '7',
            requestValue: '3',
            displayResponse: '-'
        }
    },
    created: function() {
        this.rpc = this.ds.rpc;
        this.rpc.provide( 'multiply-number', ( data, response ) => {
		    response.send( data.value * parseFloat(this.responseValue) );
        });
    },
    methods: {
        handleClick: function() {
            const data = {
                value: parseFloat(this.requestValue)
            };
            
            this.rpc.make( 'multiply-number', data, ( err, resp ) => {
                
                this.displayResponse = resp || err.toString();
            });
        }
    }
}
```

The button click makes the request and the `created` hook handles the response using the `provide` method.

The examples can be assembled together in a parent `App` component:

```javascript
new Vue({
      el: '#app',
      components: {
        'my-record': Record,
        'my-events': Events,
        'my-rpc': RPC
      },
      data: {
        ds: null
      },
      created: function() {
          this.ds = new DeepstreamClient('localhost:6020')
          this.ds.login()
      }
})
```

```html
<div id="app">
    <my-record :ds="ds"></my-record>
    <my-events :ds="ds"></my-events>
    <my-rpc :ds="ds"></my-rpc>
</div>
```

## Where to go next?
To learn how to use deepstream with other frontend frameworks head over to the tutorial section. To learn how to use the JavaScript SDK with NodeJS rather than in a browser, head over to the [getting started with NodeJS tutorial](/tutorials/getting-started/node/).
