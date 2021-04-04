const { Router } = require('express')
const MessageController = require('../controllers/MessageController')

const router = new Router()

router
  .route('/messages/:roomId')
  .get(MessageController.getMessages)
  .post(MessageController.saveMessage)

module.exports = router
