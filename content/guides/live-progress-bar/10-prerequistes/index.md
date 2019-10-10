## Serverless Server

The title is twisted but, yeah, that's what it is. The "severless" concept does not imply that servers do not exist, but the details about the server do not need to be known by they developer. Just write your code and deploy. In this example, we will make use of [Webtask](https://webtask.io) as our serverless platform.

- Install Webtask:

```bash
npm install wt-cli
```

- Create a [Webtask Account](https://webtask.io)
- Create an `index.js` in the root of an empty project folder with:

```javascript
// ./index.js
const Express = require('express');
const Webtask = require('webtask-tools');
const bodyParser = require('body-parser');
const app = Express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({text: 'hi'})
})

module.exports = Webtask.fromExpress(app);
```

- Run the app:

```bash
wt create
```

Visit the URL logged to the console and expect the following response body:

```javascript
{text: 'hi'}
```