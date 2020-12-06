import React from 'react'
import PropTypes from 'prop-types'

import './Message.css'

const Message = ({ message }) => {
  return (
    <div className="message">{`${message.userName}: ${message.messageText}`}</div>
  )
}

Message.propTypes = {
  message: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default Message
