---
title: Prerequisite
description: "Step one: What you need to know before starting this guide"
---

We will provide two simple files, one server side for the progress bar and another
for the front-end visualization

## Server

Create an `index.js` in the root of an empty project folder with:

```javascript
// ./index.js
const Express = require('express');
const bodyParser = require('body-parser');
const app = Express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({text: 'hi'})
})

app.listen(9090)
```

Visit the URL localhost:9090 and expect the following response body:

```javascript
{text: 'hi'}
```

## Visual Progress Bar

In the spirit of vanilla JS, we will be putting everything in the same (tiny) HTML file

`embed:guides/live-progress-bar/skeleton.html`