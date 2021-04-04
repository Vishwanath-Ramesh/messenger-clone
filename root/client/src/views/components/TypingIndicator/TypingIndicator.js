import React from 'react'

import useUser from '../../hooks/useUser'
import './TypingIndicator.css'

const TypingIndicator = () => {
  const { userName } = useUser()

  return (
    <div className="typingindicator">
      <div className="typingindicator__username">{`${userName} is`}</div>
      <div className="typingindicator__container">
        <div className="typingindicator__dot" />
        <div className="typingindicator__dot" />
        <div className="typingindicator__dot" />
      </div>
    </div>
  )
}

export default TypingIndicator
