import React from 'react'
import PropTypes from 'prop-types'

import useUser from '../../hooks/useUser'
import './Message.css'

const Message = ({ message }) => {
  const { userName } = useUser()

  return (
    <div
      className={`message ${userName === message.userName ? 'activeuser' : ''}`}
    >{`${message.userName}: ${message.messageText}`}</div>
  )
}

Message.propTypes = {
  message: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default Message
