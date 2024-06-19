const express = require('express'),
    app = express(),
    PORT = 2500,
    cors = require('cors');

app.use(cors())
app.use(express.json())

const http = require('http')
const server = http.createServer(app)

const socketIO = require('socket.io')
const io = new socketIO.Server(server, {
    cors: {
        origin: '*'
    }
})

const { users, rooms } = require('./data')

io.on('connection', (socket) => {
    console.log("connecting to server:", socket.id);

    let userName = socket.handshake.query?.userName
    if (userName) users[socket.id] = userName

    socket.on('join', (userName) => {
        users[socket.id] = userName
    })

    socket.emit('welcome', socket.id)

    socket.on('new-msg-client', (data) => {
        console.log(socket.id, " | new message: ", data);
        io.emit('msg-server', data);
    })
})


app.get('/room', async (req, res) => {
    res.send(rooms)
})
app.get('/room/:roomId', async (req, res) => {
    res.send(rooms.includes)
})
app.post('/login', async (req, res) => {
    let isExist = Boolean(req.body.userName) && Object.values(users).includes(req.body.userName)
    res.send(isExist)
})

server.listen(PORT, () => console.log("##### Server is UP #####"))

