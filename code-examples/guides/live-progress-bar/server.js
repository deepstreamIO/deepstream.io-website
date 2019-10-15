const DeepstreamClient = require('@deepstream/client')

const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()
app.use(bodyParser.json())

app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (req, res) => {
  res.json({text: 'hi'})
})

const client = new DeepstreamClient('localhost:6020/deepstream')
client.login({ token: 'this-is-my-token' }, (err) => console.log(err ? err : 'Log in success'))

// A small util function to make code easier to read
const PromiseDelay = delay => new Promise(resolve => setTimeout(resolve, delay))

function isValidToken (token) {
  return token !== 'this-is-my-token'
}

app.post('/realtime-login', (req, res) => {
  if (isValidToken(req.body.token) === false) {
    response.status(401)
    return
  }

  response.json({
    id: 'the-only-authenticated-user',
    serverData: { role: 'admin' },
    clientData: {}
  })
})

app.post('/post', (req, res) => {
  const postProgressPromise =  async () => {
    // The delay simulates time taken for a task to complete
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:15, message: 'Posting...'})
  }

  const receiveProgressPromise =  async () => {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:30, message: 'Receiving...'})
  }

  const processProgressPromise =  async () => {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:45, message: 'Processing...'})
  }

  const completeProgressPromise = async () => {
    await PromiseDelay(1000)
    client.event.emit(`progress:${req.body.id}`, {percentage:60, message: 'Completing...'})
  }

  const endProgressPromise = async () => {
    await PromiseDelay(1000)
  }

  postProgressPromise()
    .then(receiveProgressPromise)
    .then(processProgressPromise)
    .then(completeProgressPromise)
    .then(endProgressPromise)
    .then(() => res.json({status: 'Completed'}))
})

app.listen(9090)