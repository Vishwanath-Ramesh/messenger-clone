/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const io = require('socket.io')
const mongoClient = require('./service/database')

const app = express()

const port = process.env.PORT || 8080

app.use(express.json())
app.use(cors({ origin: '*' }))

mongoClient.connect()

app.get('/', (req, res) => {
  res.status(200).send({ result: 'SUCCESS' })
})

const server = app.listen(port)
const socket = io(server, { pingTimeOut: 60000 })
const messages = []

socket.on('connection', (clients) => {
  console.log('Socket connected')

  clients.on('Client Connect', () => {
    clients.on('sendMesage', (messageText) => {
      console.log('Received Message', messageText)
      messages.push(messageText)
      console.log('Sent messages', messages)
      clients.emit('receiveMessage', messages)
    })

    clients.on('joinRoom', (roomId) => {
      console.log('Joined room', roomId)
      clients.join(roomId)
      clients.emit('welcomeRoom', [
        {
          id: 'id10',
          messageText: 'Welcome',
          userName: 'Welcome',
        },
      ])
    })
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })
})
