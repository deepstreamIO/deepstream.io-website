---
title: Getting started with C++
description: Learn how to set-up deepstream with C++
tags: [C++, realtime, request-response, data-sync]
deepstreamVersion: V3
---

This guide will be a brief introduction to using the deepstream C++ client with
deepstream.

At present, the deepstream APIs that the C++ client supports are:
 - Events
 - Presence

{{#infobox "important"}}
Note: The C++ client is currently in beta and is therefore subject to change,
with new features being added over time. We recommend checking the
README for up-to-date information on the installation process and feature
support.
As usual if you find a bug or need help getting the client to build on your
architecture, please feel free to create an issue [on the client GitHub
repository](https://github.com/deepstreamIO/deepstream.io-client-cpp/issues) 
or [get in touch](/contact) through one of our other support channels.
{{/infobox}}

{{> start-deepstream-server}}


## Connect to deepstream and log in

From your project's directory, fetch the deepstream C++ client SDK from
GitHub:

```sh
git clone git@github.com:deepstreamIO/deepstream.io-client-cpp.git
cd deepstream.io-client-cpp
```

and follow the instructions in 
[`README.md`](https://github.com/deepstreamIO/deepstream.io-client-cpp/blob/master/README.md)
to install the necessary dependencies for your system and build the client. 


{{#infobox "info"}}
You can see the code for this example application in the file `/examples/ds-example.cpp` within the
client repository.
There is also an example [CMake](https://cmake.org/) configuration in `/examples/CMakeLists.txt`
that shows how to link against the correct dependencies for the build to succeed.
{{/infobox}}

Now, back in the our application, we can include libdeepstream:

```cpp
#include <deepstream.hpp>
```

Now you can get your app url from the dashboard and establish a connection to deepstream and log
in (we haven't yet configured authentication, so there are no credentials required). Here we use
lambda syntax to pass in a `deepstream::LoginCallback` that will be called upon successful login. 

```cpp
deepstream::Deepstream client("<YOUR APP URL>");
client.login([](const json &&user_data) {
    std::cout << "Client logged in with user data: " << user_data << std::endl;
});
```

The client uses a polling websocket library, so you'll need to make a call to
`client.process_messages` inside an event loop, to so that the client can read and service any
messages that are in the queue:
```cpp
while (/* still running */) {
  client.process_messages();
  // other application logic
  usleep(1000);
}
```

The deepstream client includes and uses [Niels Lohmann's JSON
library](https://github.com/nlohmann/json) for data interchange. [Documentation for the library is
available here](https://nlohmann.github.io/json/).

This `using` directive simply allows us to refer to JSON objects without explicitly
providing a `deepstream::` or `nlohmann::` prefix:

```cpp
using deepstream::json;
```

## Events (publish-subscribe)

{{> glossary event=true noHeadline=true}}



Clients can subscribe to events using `client.event.subscribe`:

```cpp
client.event.subscribe("test-event", [&](const json &event_data) {
  // print out the event data
  std::cout << "test event: " << event_data << std::endl;
});
```

Whenever an event is emitted, the given function is called with the payload
and publish events using `.emit`

```cpp
json data = { { "some", "data" } } // this syntax constructs the JSON object {"some": "data"}
client.event.emit("test-event", data );
```

To stop receiving event updates, we can call `client.event.unsubscribe`:

```cpp
client.event.unsubscribe("test-event");
```

## Presence

You can fetch a list of authenticated users using `client.presence.get_all`.
This method takes a callback `QueryFn` which accepts a `std::vector` of usernames:

```cpp
client.presence.get_all([](const std::vector<std::string> users){
  // print out the list of logged-in users
  std::cout << "Users: " << std::endl;
  for (const std::string &user : users) {
    std::cout << "\t" << user << std::endl;
  }
}
```

```cpp
client.presence.subscribe([&](const std::string &name, bool online) {
  // print out a status update e.g. "Eli has come online"
  std::cout << name << (online ? " has come online" : " has disconnected") << std::endl;
});
```

Unsubscribing from updates is simple:

```cpp
client.presence.unsubscribe();
```
