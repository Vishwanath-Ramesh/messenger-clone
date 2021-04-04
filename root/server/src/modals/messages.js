const utils = require('../utils/utils')

const messages = []

function getAllMessages() {
  return messages
}

function getMessagesByRoom(roomId) {
  if (!roomId) return []

  return messages.filter((message) => message.roomId === roomId)
}

function getMessagesByUser(userName) {
  if (!userName) return []

  return messages.filter((message) => message.userName === userName)
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!message.messageText)
      return reject(new Error('Message can not be empty'))

    const newMessage = {
      ...message,
      id: utils.generateGUID(),
    }
    messages.push(newMessage)

    return resolve(newMessage)
  })
}

module.exports = {
  sendMessage,
  getAllMessages,
  getMessagesByRoom,
  getMessagesByUser,
}
