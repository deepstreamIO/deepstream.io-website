---
title: Angular
description: Learn how to use Angular with deepstream
logoImage: angular.png
wip: true
---

The "new Angular" popularly known as "Angular", [though a bad name](https://toddmotto.com/please-stop-worrying-about-angular-3#real-versioning), is component architected and follows the W3C component standards thereby forcing us ( for a good reason ) to build apps as reusable UI components/widgets. This means you can't continue to build apps the exact same way you did while using Angular 1.x.

You can get started with Angular 2 using the [Quickstart guide](https://angular.io/docs/ts/latest/quickstart.html) which is enough knowledge to start using deepstream in Angular. Using deepstream in Angular is what this guide is about.

## 1. Setup Angular
Angular provides a [CLI tool](https://github.com/angular/angular-cli) which takes the pain of booting and scaffolding an Angular project by reducing the process to just one command:

```bash
# Creates a new Angular project
ng new deepchat
```

Of course, you would get an error because `ng` is not installed to your PATH but you can do so with `npm`:

```bash
# Installs the Angular CLI tool
npm install -g angular-cli
```

You can run the `new` command again to start a new project. Once that is done, the new project can actually be launched and you can do that using:

```bash
# First, move a step into
# the project directory
# if you are not there yet
cd deepchat
# Launch app
ng serve
```

![](first-run.png)

## 2. Install deepstream
deepstream needs to be installed on both the client and server. Angular is a client tool so we are focusing on the client installation but you can follow the steps [here](https://deepstream.io/tutorials/install/linux/) to install deepstream on the server.

Installing deepstream in Angular projects is quite simple. Angular bundles up scripts using Webpack and splits these bundles in a manner that makes it easier for browsers load them faster. To help Angular with this process, rather than just installing the scripts anywhere, we install with `npm` and load the script as a vendor file.

First, install via `npm`:

```bash
npm install @deepstream/client
```

To tell Angular that the install dependency is a vendor file and should be loaded accordingly, add deepstream script to the `scripts` array in `./angular-cli.json`:

```json
. . .
"scripts": [
   "../node_modules/@deepstream/client/dist/deepstream.js"
 ],
. . .
```

You can see that installation was successful by running the following command in your `AppComponent`'s constructor:

```javascript
export class AppComponent {
    constructor() {
      // Logs the deepstream function
      console.log(deepstream);
    }
}
```

Depending on your Typescript configuration, calling `deepstream` from nowhere might throw an error.

## 3. Create deepstream Service (DsService)
deepstream will work perfectly fine when used directly in the component but as your project grows large, you might find yourself in the deep mess of violating [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself). A common pattern in Angular (both 1.x and the newer versions) is to create a service that abstracts a group of tasks so this services can be used and re-used by multiple components if need be.

In our case, we need a service to group all our deepstream task and expose methods to our components to interact with:

```javascript
// ./src/app/services/ds.service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class DsService {

    private ds;
    public dsInstance;

    constructor() {
       this.ds = this.dsInstance = new DeepstreamClient('localhost:6020');
    }
}
```

The `dsInstance` is public (though we know the deal with privacy in JavaScript) so you can access all `deepstream`'s method from it. If that you think this is all you need from such service, fine, but you can also wrap the common methods by creating more members on the service:

```javascript
// ./src/app/services/ds.service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class DsService {

    private ds;
    public dsInstance;

    constructor() {
      this.ds = this.dsInstance = new DeepstreamClient('localhost:6020');
    }

    login (credentials?, loginHandler?) {
      // {username: 'chris', password:'password'}
      this.ds.login(credentials, loginHandler);
    }

    getRecord(name) {
      return this.ds.record.getRecord(name);
    }

    getList(name){
      return this.ds.record.getList(name);
    }
}
```

Those are the three methods we need to log in, create or get a record and create or get a list.

## 4. Login to deepstream
Authenticating to deepstream server does not require credentials and for simple stuffs like a demo, you can go ahead and perform and anonymous authentication:

```javascript
// ./src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { DsService } from './services/ds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // ...
})
export class AppComponent implements OnInit{
  title = 'deepChat';
  username;

  constructor(
    private ds: DsService
  ) {}

  ngOnInit() {
    // Get username from
    // window prompt and use 'anonymous' for
    // null or invalid response
    const defaultUsername = 'anonymous';
    const username = window.prompt('Please enter your username', defaultUsername);
    if (username != null) {
      this.username = username;
    } else {
      this.username = defaultUsername;
    }
    // Login without credentials
    this.ds.login(null, this.loginHandler);
  }

  loginHandler(success, data) {
    console.log('logged in', success, data);
  }

}
```

The `ngOnInit` method is a lifecycle method that is called when the component is initialized. This means that when the component is initialized, we try to authenticate deepstream with no credentials. The username is gotten from `prompt` is just used to identify who is who.

## 5. Chat Messaging

Let's create another method that will be called when the user creates a chat message:

```javascript
// ./src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { DsService } from './services/ds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'deepChat';
  username;
  text;
  chats;

  constructor(
    private ds: DsService
  ) {}

  // . . .

  addChat() {

    const recordName = 'chat/' + this.ds.dsInstance.getUid();

    const chatRecord = this.ds.getRecord(recordName);
    chatRecord.set({username: this.username, text: this.text});
    this.text = '';
    // Update the chats list
    this.chats.addEntry(recordName);
  }
}
```

The `addChat` method creates a [record](https://deepstream.io/tutorials/core/datasync/records/), sets a value to the record, clears the text property and updates the deepstream chat list with the record name.

The markup for creating messages is quite simple:

```html
// ./src/app/app.component.html
<div class="compose">
  <input type="text" [(ngModel)]="text">
  <button (click)="addChat()">Send</button>
</div>
```

We perform a two-way binding to the input with the `text` property as well as add a click event listener to the send button which calls `addChat` method.

## 6. Chat Listing
The `chats` property, for now, is undefined and is supposed to be a [deepstream list](/tutorials/core/datasync/lists/) which will hold the collection of deepstream records.

We can create this list when the component is ready, and subscribe to it as well so as to print the `chats` as they come in:

```javascript
// ./src/app/app.component.ts
// ...

@Component(...)
export class AppComponent implements OnInit{
  title = 'deepChat';
  username;
  text;
  chats;
  chatArray = [];

  constructor(
    private ds: DsService
  ) {}

  ngOnInit() {
    // . . .

    this.chats = this.ds.getList('chats');

    this.chats.on('entry-added', recordName => {

      this.ds.getRecord( recordName ).whenReady( record => {

        record.subscribe( (data) => {
          if(data.username && data.text) {
            // Update bindable property  
            this.chatArray.push(data);
          }
        }, true );

      });
    })
  }

  // . . .
}
```

What is going is, we created a list that records can be added to as seen in the `addChat` method and then listen to this list for data entry. Once the list is updated, we update the `chatArray` which is the property that we need to iterate on the UI to display the chats as shown below:

```html
<!-- ./src/app/app.component.html -->
<div class="chats">
      <p *ngFor="let chat of chatArray"><strong>{{chat.username}}: </strong> {{chat.text}}</p>
    </div>
```

![](final-app.gif)
