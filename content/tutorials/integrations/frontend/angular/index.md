---
title: AngularJS
description: Learn how to use AngularJS with deepstream
---

Angular 2 / .io is out and has been for a while, but for native JavaScript aficionados, Angular 1 is still the tool of choice.

## Is Angular a good choice with deepstream?
A reasonably good one. React's componentized architecture lends itself better to deepstream's granular data structures and Knockout's observables work like a charm with functional-reactive designs that model realtime data-flows as a network of interconnected pipelines.
But for application structure, rendering of partial view updates and usage of deepstream as a global service, Angular is still a good fit.

## What are the challenges in using deepstream with Angular?
Angular expects to be in charge of its digest loop and is built on the assumption that it will know when updates are necessary - either as a result of an user-interaction or an incoming response to a REST call through a `$resource`. Realtime updates via deepstream however can arrive at any time and require you to tell Angular when it needs to trigger a digest. This is entirely possible and works perfectly well in the real world, yet performing the necessary operation to do so, e.g. calling into

```javascript
if( !$scope.$$phase ) {
    $scope.$apply();
}
```

is considered a bit of an anti-pattern by passionate Angular-purists.

## How to use deepstream with Angular?
deepstream's records are a great fit as models for an Angular application, but there are also a few more tips worth sharing:

#### Create the deepstream client as a service
This not only makes it easily accessible within the app, but also makes it easy to mock in testing scenarios.

```javascript
angular.service( 'deepstream', function() {
    var client = deepstream( 'localhost:6020' )
    client.login({ username: 'ds-simple-input-' + client.getUid() });
    return client;
})
```

#### You can create one way bindings directly from html

By adding a record directly to the scope, your view can retrieve the latest values on every digest

```javascript
.controller( 'user', function( deepstream, $scope ) {
    $scope.user = deepstream.record.getRecord( 'user/mike' );
});
```

and in your template

```html
    <span ng-bind="user.get('firstname')"></span>
```

#### You can create an auto-magic two-way binding service
You can create a service that binds `$scope` variables to paths within a record. This way, every time a value on the record changes, it is rendered to the view - and the record gets updated every time a user enters something in the view (don't worry, there are checks to prevent recursive loops)

```javascript
service( 'twoWayBind', function(){
    return function twoWayBind( $scope, record, name ) {
        Object.defineProperty( $scope, name, {
            get: function() {
                return record.get( name );
            },
            set: function( newValue ) {
                if( newValue !== undefined ) {
                    record.set( name, newValue );
                }
            }
        });

        record.subscribe(function() {
            if( !$scope.$$phase ) {
                $scope.$apply();
            }
        });
    };
})
```

### Putting it all together
To see all this in context, have a look at deepstream's [Angular 1 example app](https://github.com/deepstreamIO/ds-demo-simple-app-ng)

![Simple App using deepstream and Angular](simple-app.png)
