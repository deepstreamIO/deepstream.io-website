// hide-next-line
const dsClient = new Client()
dsClient.on('error', (error,event,topic) => {
  console.error(error,event,topic)
})
