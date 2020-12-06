import React from 'react'
import { v4 as generateGUID } from 'uuid'

import socket from '../../../service/socket'
import Messages from '../../components/Messages/Messages'
import Avatar from '../../components/Avatar/Avatar'
import ChatRoomIcon from '../../components/ChatRoomIcon/ChatRoomIcon'
import './Home.css'

const initialMessages = [
  {
    id: 'id1',
    messageText: 'Hai',
    userName: 'Aaaa',
  },
  {
    id: 'id1',
    messageText: 'Hai',
    userName: 'Aaaa',
  },
  {
    id: 'id1',
    messageText: 'Hai',
    userName: 'Aaaa',
  },
  {
    id: 'id1',
    messageText: 'Haisssssssssssssssssssssssssssssssssss',
    userName: 'Aaaa',
  },
  {
    id: 'id1',
    messageText: 'Hai',
    userName: 'Aaaa',
  },
]

const chatRooms = [
  {
    id: 'chat-room-1',
    roomName: 'Chat Room 1',
  },
  {
    id: 'chat-room-2',
    roomName: 'Chat Room 2',
  },
  {
    id: 'chat-room-3',
    roomName: 'Chat Room 3',
  },
  {
    id: 'chat-room-4',
    roomName: 'Chat Room 4',
  },
  {
    id: 'chat-room-5',
    roomName: 'Chat Room 5',
  },
]

const Home = () => {
  const [messageText, setMessageText] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [showModal, setShowModal] = React.useState(true)
  const [activeRoom, setActiveRoom] = React.useState('chat-room-1')
  const [messages, setMessages] = React.useState(initialMessages)

  function onUserEnterHandler() {
    setShowModal(false)
  }

  function onSendMessage(event) {
    event.preventDefault()

    socket.socketclient.emit('sendMesage', {
      id: generateGUID(),
      messageText,
      userName,
    })
  }

  function onChatRoomChange(roomId) {
    setActiveRoom(roomId)

    socket.socketclient.emit('joinRoom', roomId)
  }

  React.useEffect(() => {
    socket.socketclient.on('receiveMessage', (messageData) => {
      setMessages(messageData)
    })

    socket.socketclient.on('welcomeRoom', (data) => {
      setMessages(data)
    })
  }, [])

  return (
    <>
      <div className="home">
        <div className="home__left">
          <div className="home__accountinfo">
            <div className="home__avatar">
              <Avatar />
            </div>
            <div className="home__username">{!showModal && userName}</div>
            <div className="home__status">Active</div>
          </div>
          <div className="home__roominfo">
            <div className="home__chatroomtitle">Chat Rooms</div>
            <div className="home__chatrooms">
              {chatRooms &&
                chatRooms.map((room) => {
                  return (
                    <div
                      key={room.id}
                      className={`home__chatroom ${
                        room.id === activeRoom ? 'active' : ''
                      }`}
                      onClick={() => onChatRoomChange(room.id)}
                    >
                      <div className="home__chatroom_icon">
                        <ChatRoomIcon />
                      </div>
                      <div className="home__chatroom_roomname">
                        {room.roomName}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          <div className="home__chatrooms" />
        </div>
        <div className="home__right">
          <Messages messages={messages} />
          <div className="home__message_bar">
            <input
              type="text"
              name="home__input"
              className="home__input"
              value={messageText}
              onChange={({ target }) => setMessageText(target.value)}
            />
            <input
              type="button"
              value="Send"
              className="home_send"
              disabled={messageText === ''}
              onClick={onSendMessage}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <div className="usermodal">
          <div className="usermodal__logo">
            <img
              src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100"
              alt="logo"
            />
          </div>
          <div className="usermodal__welcomemessage">Welcome to messenger</div>
          <input
            type="text"
            name="usermodal_username"
            className="usermodal_username"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
          <input
            type="button"
            value="Enter"
            onClick={onUserEnterHandler}
            className="usermodal_submit"
            disabled={userName === ''}
          />
        </div>
      )}
    </>
  )
}

export default Home
