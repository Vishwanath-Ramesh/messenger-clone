const mongoClient = require('../service/database')

class MessageController {
  static async getMessages(req, res) {
    const { params } = req

    const messages = await mongoClient
      .db('chatboard')
      .collection('messages')
      .find({ roomId: params.roomId })
      .toArray()

    res.status(200).json(messages)
  }

  static async saveMessage(req, res) {
    const { body } = req

    const messages = await mongoClient
      .db('chatboard')
      .collection('messages')
      .insertOne(body)

    res.status(201).json(messages.insertedId)
  }
}

module.exports = MessageController
