const { Deepstream } = require('./dist/src/deepstream.io')
const { Server } = require('http')

const httpServer = new Server()

const ds = new Deepstream({
    connectionEndpoints: [{ 
        type: 'ws-websocket',
        options: { 
            httpServer
        } 
    }]
})
ds.start()

httpServer.listen(6020, function(){
    console.log( 'HTTP server listening on 6020' );
})