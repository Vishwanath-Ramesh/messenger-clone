import React from 'react'
import PropTypes from 'prop-types'

import Message from '../Message/Message'

import './Messages.css'

const Messages = ({ messages }) => {
  return (
    <div className="messages">
      {messages &&
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
    </div>
  )
}

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default Messages
