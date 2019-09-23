---
title: Color Picker App using JS
description: Create a pie chart to show all the logged in users
tags: [JavaScript, Presence, Records, OpenAuth]
---

This tutorial is mainly focused on the [presence](/tutorials/core/presence/) feature of deepstream and serves as a step by step guide for building a client side application in deepstream that uses presence. 

This application will allow a client to log into deepstream and choose a color of his/her choice from the available color pallette. A pie chart will be produced that updates in real time to show the colors chosen by all the users currently logged into the application. Here's a sample of how it will look like:

![Demo output](newscreenrecordhalf.gif)

We will make use of a JS client library. Include it in your application as follows:

`embed: js/include-script.html`

Create a file named script.js and just follow along.

`embed: js/create-client.js`

The second parameter is optional. You can get more information about them, [here](/docs/client-js/options/).

In deepstream, logging errors is easy where you just have to pass an error message to the event callback, as shown below.

`embed: js/attach-error-listener.js`
