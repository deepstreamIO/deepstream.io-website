import deepstream from '@deepstream/client'
const client = new DeepstreamClient('localhost:6020')

try {
  const clientData = await client.login({
    username: 'chris',
    password: 'password' // NEEDS TO BE REAL
  })
  // Do stuff now your authenticated
} catch (error) {
  // Unhappy path of an unsuccesful login
}
