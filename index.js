const express = require('express'),
    app = express(),
    PORT = 2500,
    cors = require('cors');

const http = require('http')
const server = http.createServer(app)

const socketIO = require('socket.io')
const io = new socketIO.Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log("connecting now:",socket.id);
    
    socket.on('new-msg-client',(data)=>{
        console.log(socket.id, " | new message: ",data);
        io.emit('msg-server',data);
    })
})


app.get('/', async (req, res) => {
    res.send('api work!')
})

server.listen(PORT, () => console.log("##### Server is UP #####"))

