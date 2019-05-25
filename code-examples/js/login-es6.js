import deepstream from 'deepstream.io-client-js'
const client = deepstream('localhost:6020')

try {
  const clientData = await client.login({
    username: 'chris',
    password: 'password' // NEEDS TO BE REAL
  })
  // Do stuff now your authenticated
} catch (error) {
  // Unhappy path of an unsuccesful login
}
