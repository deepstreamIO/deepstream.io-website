---
title: Realtime friend locator
description: Create a web app that returns the location of those around you in Realtime
tags: [React, Rethinkdb, Geolocation, JavaScript, Google Maps]
---

![Locate Your Friends](locator.gif)

One of the exciting things about deepstream is that it allows you to get geospatial updates in realtime. In this tutorial, we are going to make an app that shows the location of all members, who are logged in, who are within a one kilometer radius. We will be using RethinkDB in combination with deepstream to do our geospatial queries, and google maps to display our results.

## Connecting deepstream with Rethinkdb

Deepstream.io already has a great tutorial up about using RethinkDB with deepstream. You can find out more on how to [integrate RethinkDB with deepstream](/tutorials/plugins/database/rethinkdb/) here. RethinkDB will store all the actual data when deepstream creates records, and deepstream will only pull the data from RethinkDB once it subscribes to that particular record.

Another great reason for using RethinkDB for this project, is for its ability to do geospatial queries. Instead of having to access each record we create through deepstream, RethinkDB can first do a geospatial query with the coordinates that are stored, then deepstream can subscribe to a list of results that are populated by the query, and finally subscribe only to those records that we want from the database query. This will result in faster load times, since we won't have to subscribe and unsubscribe to every record that exists. Instead we'll only subscribe to the records we want.

## Creating a map with Google maps

To create a map using Google Maps API, you first need to get an [API key](https://developers.google.com/maps/documentation/javascript/get-api-key), and follow the directions on how to included it in your HTML.

## Setting deepstream up with React

Setting up deepstream in React is actually quite simple. Once you download and install deepstream, connecting to the deepstream server looks like:

#### In your constructor connect to deepstream:

```js
this.ds = deepstream('<Your deepstream url>');
// handle error here, in case of error
this.ds.on( 'error', this._onError.bind( this ) );
```

to keep things simple for this tutorial, we will skip password authentication, and just use the user's username to log into the deepstream server.

#### To handle login, once a user has submitted their name:

```js
login( username, callback ) {
    this.username = username;
    this.callback = callback;
    this.ds.login( {username: username }, this._onLoginResult.bind( this ) );
}

_onLoginResult( success ) {
    if( success ) {
        this._initialize();
    } else {
        this.callback( false );
    }
}

_initialize() {
    // here we create the record if it doesn't exist, or get the record if it
    //exists.
    this.record = this.ds.record.getRecord( 'user/' + this.username );
    // the whenReady() method, ensures the record is fully loaded before
    // continuing, and takes a callback.
    this.record.whenReady( this._onRecordCheckComplete.bind( this ) );
}

_onRecordCheckComplete( record ) {
    // the set() method allows us to now set data.
    this.record.set('username', this.username);
    this.callback( true );
}
```

## Getting coordinates, and subscribing to a list

Now that a user is logged in, we need to get their latitudinal and longitudinal coordinates. HTML5 makes this easy with its [navigator object](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) that we can query for coordinates. Once we have their coordinates, we can listen to the user's position updates with the *watchPosition* method:

```js
navigator.geolocation.watchPosition();
```

This method gets called every time the logged in user's position changes. So we will want to pass to it a callback that will update the user's coordinates, and do a geospatial query upon position change. This will look like:

```js
navigator.geolocation.watchPosition( this.onPositionUpdate.bind( this ) );

onPositionUpdate( position ) {
    this.pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    //sets the position of this record to the current latitude and longitude
    this.record.set( 'position', this.pos );
}
```

In this function, we will also want to create a list that contains the user's current latitude and longitude. This list is what we will listen to on the backend to run our database queries:

```js
onPositionUpdate( position ) {
    this.pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    this.record.set( 'position', this.pos );
    //creates the list that contains our latitude and longitude
    this.list = ds.record.getList('users_within_radius/' + this.pos.lat + '/' + this.pos.lng + '/' + 1 + '/' + this.username)
    this.list.subscribe( this._onGetEntries.bind( this ) );
    //setCenter is a method called to find the center for the map,
    //that was created with google maps api
    this.map.setCenter( this.pos );
    this.circle.setCenter( this.pos );
}
```
## Listening for subscribed users

Now we are ready to find all the users who are within a kilometer radius of us, and who are logged in to the app. We will be using the listen method to pull our data out of this list we created, that contains our latitude and longitude.

The listen method is called every time there is a change in record subscriptions, with our *isSubscribed* callback either returning true if there is a subscription, or false if there is not. Once there are events to subscribe to and we accept the response, we can start publishing data that will be populated from our database. There is more information about this in the  [events turorial](/tutorials/core/active-data-providers/).

```js
//server side
const GeoSubscription = require( './geo-subscription' );
const deepstream = require('@deepstream/client');

const ds = deepstream('ws://localhost:6020')
ds.login()

ds.on( 'error', function(error) {
    console.log(error);
});

const geoSubscriptions = {};

//here we listen to the list we created upon logging in.
//the match will contain all the information in our list after the "/.*" . We our sending the match to the geoSubscription module, where we will extract its data and perform a RethinkDB query.

ds.record.listen('users_within_radius/.*', (match, isSubscribed, response) => {
    if( isSubscribed ) {
        //start publishing data
        response.accept();
        if( !geoSubscriptions[ match ] ) {
            geoSubscriptions[ match ] = new GeoSubscription( match, ds );
        }
    } else {
        //stop publishing data
        if( geoSubscriptions[ match ]) {
            geoSubscriptions[ match ].destroy();
            delete geoSubscriptions[ match ];
        }
    }
})
```

## Performing a RethinkDB geospatial query

In our *GeoSubscription* class, we now can run a geospatial query with the longitude and latitude, that we passed from our list, against the position of all other users that are also logged in. Here is where we filter out the users who are out of our range (1 kilometer radius) before ever having to subscribe to their records.

First, in your constructor, access the list that was passed into the match:

```js
this.list = this.ds.record.getList( match );
this.list.whenReady(this._queryDb.bind( this ));
```

Now that we are connected to the correct list, we can perform a database query with this match.
here is a link to the [RethinkDB api](https://www.rethinkdb.com/api/javascript/) which will be very helpful.

In order to perform geospatial queries in RethinkDB, we need to convert the longitude and latitude into an object point (*r.point()*). It would be wonderful to convert latitude and longitude into these points upon directly receiving them, but deepstream can't store database specific structures.

```js
_queryDb() {
    // *match* is returned as a string, and needs to be broken into an array, and extracted as follows
    const [, lat, lng, radius] = + this.match.split( '/' );

    r.db('realtime').table('user').filter(function( user ) {
            //performs a geospatial query based on two object points in RethinkDB
        return r.distance(
            r.point( user('position')('lng'), user('position')('lat') ), //users who are logged in
            r.point( lng, lat ), //this user's coordinates from the match
            {unit: 'km'}
        ).lt( radius ) // only populates users who are within the radius provided
        //here, .changes() allows us to subscribe to position locations of users returned in the query
    })('ds_id').changes({includeInitial: true}).run( db.conn, this._onDbResult.bind( this ) ); //this callback passes the names of all the users that are logged in, and within the radius of the query.
}

_onDbResult( err, cursor ) {
    if ( err ) {
        throw err
    }
    this.cursor = cursor;
    this.cursor.each( this._updateList.bind( this ) )
}

_updateList( err, result ) {
    if( err ) {
        throw err;
    }

    if( result.new_val && this.list.getEntries().indexOf( result.new_val ) === -1 ) {
        //adds the users within the radius to a new list
        this.list.addEntry( result.new_val );
    } else {
        this.list.removeEntry( result.old_val );
    }
}
```
## Subscribe to the user records

Now back to the client-side code. Recall that we subscribed to our list in our *onPositionUpdate* function:

```js
this.list.subscribe( this._onGetEntries.bind( this ) );
```
As the list of users is updated from our database query, we can now loop through the results and start putting markers on our map:

```js
_onGetEntries( users ) {
    let recordNames = this.list.getEntries();
    this._updateMarkers( recordNames );
}

_updateMarkers( userRecordNames ) {
    for( let i = 0; i < userRecordNames.length; i++) {
        if( !this.markers[ userRecordNames[ i ] ] ) {
            //for each list entry, we create a new marker instance,
            //where we can subscribe to the record corresponding with the list entry
            this.markers[ userRecordNames[ i ] ] = new Marker( userRecordNames[ i ], this.map, this.username );
        }
    }

    for( let userRecordName in this.markers ) {
        if( userRecordNames.indexOf( userRecordName ) === -1 ) {
            this.markers[ userRecordName ].destroy();
            delete this.markers[ userRecordName ];
        }
    }
}
```
In the Marker class, we can now subscribe to each user's record who is within our radius, get their coordinates, and place a marker at their location. If a user logs off or walks out of range, the list will be updated, and the record will be unsubscribed to.

```js
//subscribe to each record of a user within radius
this.record = dsService.ds.record.getRecord( 'user/' + recordName )
this.record.subscribe( 'position', this._updateMarkerPosition.bind( this ), true );
```
Now, fill your map with Markers using Google Maps API!

```js

destroy() {
    //make sure to call the setMap(null) function on the marker you are destroying, or it will remain on the map
    this.marker.setMap(null)
    this.record.unsubscribe();
    this.record = null;
    this.marker = null;
}

_updateMarkerPosition( position ) {
    if( !position ) {
        return;
    }
    if( this.marker === null ) {
        this._addMarker();
    }
    this.marker.setPosition( this._getPosition() );
}

_getPosition() {
    return new window.google.maps.LatLng(
        this.record.get( 'position.lat' ),
        this.record.get( 'position.lng' )
    )
}

_addMarker() {
    this.marker = new window.google.maps.Marker({
        position: this._getPosition(),
        map: this.map,
        title: this.record.get( 'username' )
    });
}
```

## Where to go next

Now that we've outlined how to make a simple app that shares user's locations with others, there are many ways to expand upon this and develop it into a useful application. For starters, it would be good to implement some sort of [user authentication](/docs/server/user-file/). You could also perform more complex geolocation queries based on user input. For example, maybe users can choose the radius that the database queries, or you could map out walking directions to a selected user. With the real-time geo-location structure in place, there are myriads of directions to now take this application.
