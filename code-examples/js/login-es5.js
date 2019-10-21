// ES5
const { DeepstreamClient } = require('@deepstream/client')
const client = new DeepstreamClient('localhost:6020');

client.login({
  username: 'chris',
  password: 'password' // NEEDS TO BE REAL
}, (success, clientData) => {
  if (success) {
    // Do stuff now your authenticated
  } else {
      // Unhappy path of an unsuccesful login
  }
})