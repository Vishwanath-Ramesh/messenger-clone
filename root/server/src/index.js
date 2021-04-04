/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const io = require('socket.io')

const { createUser } = require('./modals/users')
const {
  sendMessage,
  getMessagesByUser,
  getAllMessages,
  getMessagesByRoom,
} = require('./modals/messages')

const app = express()

const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send({ result: 'SUCCESS' })
})

const server = app.listen(port)
const socket = io(server, {
  pingTimeOut: 60000,
  cors: {
    origin: '*',
    credentials: true,
  },
})

socket.on('connection', (client) => {
  client.on('userLoggedin', (user, callback) => {
    createUser({ ...user, id: client.id })
      .then((response) => {
        client.userName = response.userName
        client.roomId = response.roomId
        client.join(response.roomId)

        const messages = getMessagesByRoom(response.roomId)
        client.emit('receiveMessage', messages)

        // Notify other users in the room when new user joined
        client
          .to(response.roomId)
          .broadcast.emit('notify', `${response.userName} has joined the room`)
        if (callback) callback(response)
      })
      .catch((err) => callback && callback({ error: err.message }))
  })

  client.on('sendMesage', (message) => {
    sendMessage(message).then((response) => {
      const messages = getMessagesByRoom(client.roomId)
      socket.to(response.roomId).emit('receiveMessage', messages)
    })
  })

  client.on('joinRoom', ({ userName, roomId }, callback) => {
    client.roomId = roomId
    client.join(roomId)
    client
      .to(roomId)
      .broadcast.emit('notify', `${userName} has joined the room`)
    const messages = getMessagesByRoom(roomId)
    client.emit('receiveMessage', messages)
    if (callback) callback()
  })

  client.on('leaveRoom', (userName) => {
    client.roomId = null
    client.leave(client.roomId)
    client
      .to(client.roomId)
      .broadcast.emit('notify', `${userName} has left the room`)
  })
})

/*
socket.on('connection', (client) => {
  client.on('clientConnect', async ({ userName, roomId }) => {
    client.userName = userName
    client.roomId = roomId
    const messages = await getMessages(roomId)
    // client.to(client.roomId).emit('receiveMessage', messages)
    client.emit('receiveMessage', messages)
  })

  client.on('joinRoom', async ({ userName, roomId }) => {
    client.roomId = roomId
    client.join(roomId)
    const messages = await getMessages(roomId)
    client.emit('receiveMessage', messages)
    client.broadcast
      .to(roomId)
      .emit('notify', `${userName} has joined to ${roomId} room`)
    // socket.in(roomId).emit('user joined', 'data')
    // io.in(data.oldRoom).emit('user left', data)
    // io.in(data.newRoom).emit('user joined', data)

    // clients.emit('welcomeRoom', [
    //   {
    //     id: 'id10',
    //     messageText: 'Welcome',
    //     userName: 'Welcome',
    //   },
    // ])
  })

  client.on('leaveRoom', (userName) => {
    client.leave(client.roomId)
    client.broadcast
      .to(client.roomId)
      .emit('notify', `${client.userName} has left ${client.roomId}`)
  })

  client.on('typing', (userName) => {
    client.to(client.roomId).emit('isTyping', userName)
  })

  client.on('sendMesage', async (message) => {
    await mongoClient.db('chatboard').collection('messages').insertOne(message)
    const messages = await getMessages(message.roomId)
    client.to(client.roomId).emit('receiveMessage', messages)
  })

  client.on('disconnect', () => {
    client.leave(socket.roomId)
    // if (client.userName)
    client.broadcast.emit('notify', `${client.userName} has disconnected`)
  })

  client.on('error', (err) => {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})
*/
