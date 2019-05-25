---
title: Music Collection (CRUD)
description: Realtime state management in CRUD apps using deepstream events
tags: [Events, Angular, Javascript, CRUD, Pub-Sub]
navLabel: Music Collection
---
A common concern in component architecture is passing data around (mostly from parent to grandchildren, grandchildren to parent and among sibling components). The first thing that could come to mind is to use a Flux implementation, but sometimes this becomes an overkill. When that is the case, you could decide to opt for an event hub.

Speaking of events, rather than a local event hub, you could employ deepstream event to not only manage state for you but provide this state to all connected clients in realtime.

Let's see how we could achieve this by building a CRUD app for managing collection of album and album's tracks using Angular as our UI tool.

![Final app](/images/tutorial/album-collection/final.gif)

deepstream provides a JavaScript library which helps in interacting with your deepstream server.

## Create an Angular App

Install the Angular CLI tool globally and use the tool to scaffold a new app:

```bash
# Install CLI tool
npm install -g @angular/cli
# Scaffold a new app
ng new album-collection
```

## Connect to deepstream and log in

After you have successfully created an Angular app install the deepstream and the JS-client library in your new project:

```bash
npm install deepstream.io-client-js --save
```

To tell Angular that the installed dependency is a vendor file and should be loaded accordingly, add deepstream script to the `scripts` array in `./angular-cli.json`:

```json
. . .
"scripts": [
   "../node_modules/deepstream.io-client-js/dist/deepstream.js"
 ],
. . .
```

## Deepstream Service:

```ts
import {Injectable} from "@angular/core";
import * as deepstream from 'deepstream.io-client-js'

@Injectable()
export class DsService {
  get dsInstance() {
    return deepstream('<Your deepstream URL>').login()
  }
  get event () {
    return this.dsInstance.event
  }
}
```

`dsInstance` returns an instance of deepstream connection which is opened after the `login` method is called. deepstream has three strategies for handling realtime data; we are interested in events so we expose it via `event` getter.

Let's briefly discuss what events are in deepstream context.

## deepstream Events

`markdown:glossary-event.md`

Events, aka Pub/Sub, allows communication using a Publish-Subscribe pattern. A client/server emits an event, which is known as publishing and all connected (subscribed) clients/servers are triggered with the event's payload if any. This is a common pattern, not just in realtime systems, but software engineering generally.

Clients and backend processes can receive events using `.subscribe()`

```javascript
ds.event.subscribe( 'album', eventData => { 
  /*do stuff like updating a list of albums*/ 
});
```

... and publish events using `.emit()`

```javascript
ds.event.emit( 'album', {some: 'data'} );
```

## Fetching List of Albums and Tracks
![List interaction](/images/tutorial/album-collection/album-tracks.png)
_Album track relationship_

The UX as shown in the image above demands that we have a list of tracks that is updated once an item gets clicked in the list albums. These means that an album could have 0 - n number of tracks and we should show users these tracks when the parent album gets clicked.

To achieve this relationship we need a unique id for each track that points to whatever album it belongs to. The following is a service that stores the albums and tracks:

```ts
import { Injectable } from '@angular/core';
import { Album, Track } from './data';
import {DsService} from "./ds.service";

@Injectable()
export class DataService {

  constructor(
    public dsService: DsService
  ) { }

  private albums: Album[] = [
    {
      id: 1,
      title: 'The Chief',
      category: 'Hip/Hop',
      year: '2017',
      artist: 'Jidenna'
    },
    {
      id: 2,
      title: 'The Playmaker',
      category: 'Afro Hip/Hop',
      year: '2016',
      artist: 'Phyno'
    }
  ];
  private tracks: Track[] = [
    {
      title: 'Bambi',
      number: 4,
      duration: '4:10',
      albumId: 1
    },
    {
      title: 'Little Bit More',
      number: 11,
      duration: '3:26',
      albumId: 1
    },
    {
      title: 'The Let Out',
      number: 8,
      duration: '3:43',
      albumId: 1
    },
    {
      title: 'Mistakes',
      number: 14,
      duration: '4:15',
      albumId: 2
    },
    {
      title: 'So Far So Good (SFSG)',
      number: 12,
      duration: '4:03',
      albumId: 2
    }
  ];

  public getTracks() {
    return this.tracks.sort((a, b) => {
      if(a.number < b.number) return -1;
      if(a.number > b.number) return 1;
      return 0;
    });
  }

  public getAlbums() {
    return this.albums.sort((a, b) => {
      if(a.title < b.title) return -1;
      if(a.title > b.title) return 1;
      return 0;
    });
  }
  
  public getTracksByAlbumId(id) {
    return this.tracks.filter(track => track.albumId == id);
  }
  ...
}
```

The service also exposes some methods to retrieve all albums, all tracks and all tracks based on an album's id. We will add more methods to create and update albums/tracks later.

With the data available, you can inject it into the component, pass the values to a property and iterate over the values in the template:

```ts
export class AlbumListComponent implements OnInit {

  albums;

  constructor(
    public dsService: DsService,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.albums = this.dataService.getAlbums();
  }

  updateTrackList(id) {
    this.dsService.event.emit('update-tracklist', id);
  }

}
```

```html
<app-album-item
  *ngFor="let album of albums"
  [album]="album"
  (albumClick)="updateTrackList($event)"
></app-album-item>
```

This is where things start to get interesting. The `updateTrackList` method is called when an item in the albums list is clicked. It receives the id and emits an `update-tracklist` event. After that, the event is subscribed to in the `TracksComponent` to update the tracks view:

```ts
export class TrackListComponent implements OnInit {

  tracks: Track[];

  constructor(
    public dataService: DataService,
    public dsService: DsService
  ) { }

  ngOnInit() {
    this.tracks = this.dataService.getTracks();
    this.dsService.event.subscribe('update-tracklist', id => {
      this.tracks = this.dataService.getTracksByAlbumId(id);
    })
  }
}
```

The `subscribe` handler receives the id which is used to get the respective album tracks. The tracks are then iterated over in the template:

```html
 <app-track-item *ngFor="let track of tracks" [track]="track"></app-track-item>
```

That completes the fetch/read (R) stage in the CRUD process.

## Creating Entries
![List interaction](/images/tutorial/album-collection/create.png)

The Angular Form module makes it easy to create forms with dynamic controls using `FormArray`. With dynamic controls, you can have an array of form controls to add and remove multiple album **tracks**. You can learn more about `FormArray` [here](https://angular.io/docs/ts/latest/api/forms/index/FormArray-class.html).

When the form is eventually submitted with `ngSubmit` event, the form values are passed to the handler:

```html
<form [formGroup]="modalForm" (ngSubmit)="save(modalForm.value)">
</form>
```

```ts
export class ModalComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public dsService: DsService,
    public dataService: DataService
  ) {

  }

  ngOnInit() {

   ...
   
    this.dsService.event.subscribe('new-album', album => {
      this.dataService.addAlbum(album);
    });
    this.dsService.event.subscribe('new-tracks', track => {
      this.dataService.addTrack(track);
    });
    ...
  }

  save(values) {
    this.saveAlbum(values).saveTracks(values);
  }

  saveAlbum(values) {
    const clonedValues = Object.assign({}, values);
    delete clonedValues.tracks;
    // Emit new-album event
    this.dsService.event.emit('new-album', clonedValues)
    return this;
  }

  saveTracks(values) {
    // Emit new tracks event
    this.dsService.event.emit('new-tracks', values.tracks)
    return this;
  }

}
```


The form is contained in a modal (which we can ignore), so we can concentrate on what happens when we try to submit the form.

`save` method calls the `saveAlbum` and `saveTracks` methods in a chained manner. `saveAlbum` emits `new-album` which has a subscription in the `ngOnInit` lifecycle to update the albums array likewise `saveTracks` to update the tracks array.

`dataService.addAlbum` and `dataService.addTracks` are methods exposed by the data service class to add albums and tracks respectively:

```ts
public addAlbum(album) {
  this.albums.push(album);
}

public addTrack(tracks) {
  tracks.forEach(v => {
    this.tracks.push(v);
  })
}
```

## Updating Entries
![List interaction](/images/tutorial/album-collection/edit.png)

Updating is a lot more like creating with just the difference being that the album id is used to track which albums and tracks are being updated. The `saveAlbum` and `saveTracks` methods also handle the updates but with an `editing` flag to determine whether the user is in an edit state or create state:

```ts
...

ngOnInit() {
  ...
  this.dsService.event.subscribe('update-album', album => {
     this.dataService.updateAlbum(album);
   });
   this.dsService.event.subscribe('update-tracks', tracks => {
     this.dataService.updateTrack(tracks);
   });
  ...
}

saveAlbum(values) {
  const clonedValues = Object.assign({}, values);
   delete clonedValues.tracks;
   if(this.editing){
     this.dsService.event.emit('update-album', clonedValues)
   } else {
     this.dsService.event.emit('new-album', clonedValues)
   }
   return this;
 }

saveTracks(values) {
   if(this.editing){
     this.dsService.event.emit('update-tracks', values.tracks)
   } else {
     this.dsService.event.emit('new-tracks', values.tracks)
   }
   return this;
 }
 ...
```

The data service class is also delegated to handle the data update via the event subscription handler.

An important task during the update process is to pre-populate the form with the entry we intend to edit. We could get the entry and set the form to the values retrieved:

```ts
public defaults;

this.dsService.event.subscribe('edit-album', id => {
   this.defaults = this.dataService.getAlbumTracks(id)
   let tracks = this.defaults.tracks;
   if(tracks){
     Object.keys(tracks).forEach((v, i) => {
       // update tracks controls
     });
     // Patch control values
   }
 });
```

The `defaults` property is bound to the form so if it exists; the form values will be equal to the selected album and album tracks. This happens when the `edit-album` event is emitted which is triggered when edit button is clicked:

```ts
edit(id) {
   this.dsService.event.emit('edit-album', id)
 }
```

```html
<button (click)="edit(albumTracks[0].albumId)"><span class="glyphicon glyphicon-edit"></span> Edit </button>
```

## Deleting Entries
Deleting is always the easiest part of the CRUD process. Just like every other process, listen to a click event, emit the `delete-album` event and remove the data via the event subscription:

```ts
this.dsService.event.subscribe('delete-album', id => {
   // deleteAlbumTracks in the data service
   // removes the selected album 
   this.dataService.deleteAlbumTracks(id);
 });
deleteAlbum(id) {
 this.dsService.event.emit('delete-album', id)
}
```

## Final Notes

- __Source and Example__: The examples presented here are truncated so as to emphasize more on the main point which is realtime CRUD eventing. The full code can be found on [GitHub](https://github.com/deepstreamIO/example-app-album-collection) and the live demo [here](https://deepstreamio.github.io/example-app-album-collection/dist/)
- __More Options__: deepstream offers other strategies apart from [Events](/tutorials/core/pubsub/). Consider having a look at [Records](/tutorials/core/datasync/records/) or [RPCs](/tutorials/core/request-response/) to know what works best in your application
