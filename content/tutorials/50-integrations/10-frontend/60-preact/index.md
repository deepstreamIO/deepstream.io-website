---
title: Preact
description: Learn how to use Preact with deepstream
tags: [Preact, realtime, RPC, request-response, data-sync]
logoImage: preact.png
draft: true
---

Getting started with deepstream is easy and takes less than ten minutes. However, if you have any questions, please <a href="/contact/">get in touch</a>.

This is a Preact guide that will take you through deepstream's three core concepts: <a href="/tutorials/guides/records/">Records</a>, <a href="/tutorials/guides/events/">Events</a> and <a href="/tutorials/guides/remote-procedure-calls/">RPCs</a>.

`create-preact-app` will assist you to scaffold a new Preact app easily, and we'll use the <a href="/docs/client-js/client/">JavaScript client SDK</a> to interact with deepstream.

`markdown:setting-up-deepstream.md`

## Create a Preact App
Install `create-preact-app` globally, and use the tool to scaffold a new app:

```bash
# Install create-preact-app
npm install -g create-preact-app
# Scaffold new app
create-preact-app ds-preact
```

## Connect to deepstream and log in

Install the JS library to the `ds-preact` app you just created:

```bash
# With yarn
yarn add @deepstream/client
# With npm
npm install @deepstream/client --save
```

Get your app url from the dashboard, establish a connection to deepstream, and login (we'll not configure any authentication, because there are no credentials required):


```js
// ./src/App.js
import createDeepstream from '@deepstream/client';
import { h, render, Component } = 'preact';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // Connect to deepstream
    this.ds = createDeepstream('<YOUR APP URL>');
    // Login
    this.ds.login();
  }  
}

export default App;
```

## Records (realtime datastore)
`markdown:glossary-record.md`

Creating a new record or retrieving an existent one works the same way:

```javascript
const myRecord = ds.record.getRecord( 'test/johndoe' );
```

Values can be stored using the `.set()` method:

```javascript
myRecord.set({
    firstname: 'John',
    lastname: 'Doe'
});
```

Let's set up two-way bindings with an input field - whenever a path within our record changes (e.g. `firstname`), we want to update the input. Whenever a user types, we want to update the record.

![Two-way realtime bindings](/assets/img/tutorial/browser-app/realtime-datastore.gif)

First, we setup the record and subscribe for changes in the constructor:

```js
// ./src/Record/Record.js
// . . .
class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: ''
        };

        // Receive record from parent component
        // <Record record={this.client.record}></Record>
        this.record = this.props.record;
        // Bind handleChange method to the right 'this'
        this.handleChange = this.handleChange.bind(this);

        this.record.subscribe(value => {
            // Update state on input change
            this.setState({firstname: value.firstname});
            this.setState({lastname: value.lastname});
        });
    }
}
```

then we create the render method for the template which includes the input fields:

```js
// . . .
class Record extends Component {
    // . . .
    render() {
        return(
            <div className="group realtimedb">
                <h2>Realtime Datastore</h2>
                <div className="input-group half left">
                    <label>Firstname</label>
                    <input type="text" value={this.state.firstname} onChange={this.handleChange} id="firstname"/>
                </div>
                <div className="input-group half">
                    <label>Lastname</label>
                    <input type="text" value={this.state.lastname} onChange={this.handleChange} id="lastname"/>
                </div>
            </div>
        );
    }
}
```

and finally, we add the `handleChange` method to sync the input fields state:

```js
class Record extends Component {
    // . . .
    handleChange(e) {
        // Handle change and update state
        // based on the values change.
        if(e.target.id === 'firstname') {
            // When 'firstname' changes
            this.setState({firstname: e.target.value});
            this.record.set('firstname', e.target.value);
        } else if(e.target.id === 'lastname') {
            // When 'lastname' changes
            this.setState({lastname: e.target.value});
            this.record.set('lastname', e.target.value);
        }
    }
 //. . .
}
```

## Events (publish-subscribe)
`markdown:glossary-event.md`

![Publish-Subscribe](/assets/img/tutorial/browser-app/pubsub.gif)

Clients and backend processes can receive events using `.subscribe()`:

```javascript
constructor() {
    // Receive event object from parent container, App.
    // <Event event={this.client.event}></Event>
    this.event = this.props.event;
    this.event.subscribe('event-data', data => {
        // Handle event
        this.setState({eventsReceived: [...this.state.eventsReceived, data]})
        this.setState({value: ''});
    }.bind(this));
}
```

... and publish events using `.emit()`:

```javascript
handleClick(e) {
    this.event.emit('event-data', this.state.value);
}
```

## RPCs (request-response)
`markdown:glossary-rpc.md`

![Request Response](/assets/img/tutorial/browser-app/request-response.gif)

You can make a request using `.make()`:

```javascript
handleClick(e) {
    // read the value from the input field
    // and convert it into a number
    const data = {
        a: parseFloat(this.state.a),
        b: parseFloat(this.state.b)
    };

    // Make a request for `multiply-number` with our data object
    // and wait for the response
    this.rpc.make('multiply-number', data, function( err, resp ){
        //display the response (or an error)
        this.setState({displayResponse: resp || err.toString()});
    }.bind(this));
}
```

and answer using `.provide()`:

```javascript
constructor() {
    // Receive rpc object from parent container, App
    // <RPC rpc={this.client.rpc}></RPC>
    this.rpc = this.props.rpc;
    this.rpc.provide( 'multiply-numbers', ( data, response ) => {
        response.send( data.a * data.b );
    });
}
```
