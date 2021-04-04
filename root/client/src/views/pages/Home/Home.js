import React from 'react'
import { TextField, Select, FormControl, InputLabel } from '@material-ui/core'
import { v4 as generateGUID } from 'uuid'
import { useSnackbar } from 'notistack'

import useUser from '../../hooks/useUser'
import socket from '../../../service/socket'
import Messages from '../../components/Messages/Messages'
import TypingIndicator from '../../components/TypingIndicator/TypingIndicator'
import Avatar from '../../components/Avatar/Avatar'
import ChatRoomIcon from '../../components/ChatRoomIcon/ChatRoomIcon'
import './Home.css'

const initialMessages = [
  {
    id: 'id1',
    messageText: 'Hai',
    userName: 'Aaaa',
    roomId: 'chat-room-1',
  },
  {
    id: 'id2',
    messageText: 'Hai',
    userName: 'Aaaa',
    roomId: 'chat-room-2',
  },
  {
    id: 'id3',
    messageText: 'Hai',
    userName: 'Aaaa',
    roomId: 'chat-room-3',
  },
  {
    id: 'id4',
    messageText: 'Haisssssssssssssssssssssssssssssssssss',
    userName: 'Aaaa',
    roomId: 'chat-room-4',
  },
  {
    id: 'id5',
    messageText: 'Hai',
    userName: 'Aaaa',
    roomId: 'chat-room-5',
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

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM':
      return { ...state, roomId: action.roomId }
    case 'SHOW_MODAL':
      return { ...state, showModal: action.showModal }
    case 'SET_MESSAGETEXT':
      return { ...state, messageText: action.messageText }
    case 'SET_MESSAGES':
      return { ...state, messages: action.messages }
    default:
      throw new Error(`Invalid action ${action.type}`)
  }
}

const Home = () => {
  const initialState = {
    roomId: 'chat-room-1',
    showModal: true,
    messageText: '',
    messages: [],
  }
  const [userName, setUserName] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [activeRoom, setActiveRoom] = React.useState('chat-room-1')
  const [state, dispatch] = React.useReducer(chatReducer, initialState)
  const { UserProvider } = useUser()
  const { enqueueSnackbar } = useSnackbar()

  function onUserConnected(response) {
    if (response.error)
      return enqueueSnackbar(response.error, {
        variant: 'error',
      })

    return enqueueSnackbar(`Welcome ${response.userName}!`, {
      variant: 'success',
    })
  }

  function onUserEnterHandler() {
    socket.socketclient.emit(
      'userLoggedin',
      {
        userName,
        roomId: state.roomId,
      },
      onUserConnected
    )

    dispatch({ type: 'SHOW_MODAL', showModal: false })
  }

  function onSendMessage(event) {
    event.preventDefault()

    socket.socketclient.emit('sendMesage', {
      messageText: state.messageText,
      userName,
      roomId: activeRoom,
    })
    dispatch({ type: 'SET_MESSAGETEXT', messageText: '' })

    setIsTyping(false)
  }

  function onChatRoomChange(roomId) {
    socket.socketclient.emit('leaveRoom', userName)

    socket.socketclient.emit('joinRoom', { userName, roomId }, () => {
      setActiveRoom(roomId)
    })
  }

  function onKeyPressHandler(event) {
    const keycode = event.keyCode ? event.keyCode : event.which

    if (keycode !== '13') socket.socketclient.emit('typing', userName)
  }

  React.useEffect(() => {
    socket.socketclient.on('isTyping', (userName) => {
      setIsTyping(true)
    })

    socket.socketclient.on('notify', (message) => {
      enqueueSnackbar(message, {
        variant: 'info',
      })
    })

    socket.socketclient.on('receiveMessage', (messages) => {
      dispatch({ type: 'SET_MESSAGES', messages })
    })
  }, [])

  // React.useEffect(() => {
  //   // TODO : Get messages from api
  //   async function fetchData() {
  //     getAPIData(
  //       apiEndPoints.getMessages.method,
  //       `${apiEndPoints.getMessages.url}/${activeRoom}`
  //     ).then((response) => setMessages(response.data))
  //   }
  //   fetchData()
  // }, [])
  // //psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/

  const { roomId, showModal, messages, messageText } = state

  return (
    <UserProvider value={{ userName }}>
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
                      role="presentation"
                      className={`home__chatroom ${
                        room.id === activeRoom ? 'active' : ''
                      }`}
                      onClick={() => onChatRoomChange(room.id)}
                    >
                      <div className="home__chatroom_roominfo">
                        <div className="home__chatroom_icon">
                          <ChatRoomIcon />
                        </div>
                        <div className="home__chatroom_roomname">
                          {room.roomName}
                        </div>
                      </div>
                      <div className="home__chatroom_usersonline">
                        <span className="home__chatroom_usersonlinelabel">
                          {'Users online : '}
                        </span>
                        <span className="home__chatroom_usersonlinecount">
                          {10}
                        </span>
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
          {isTyping && <TypingIndicator />}
          <div className="home__message_bar">
            <input
              type="text"
              name="home__input"
              className="home__input"
              value={messageText}
              onKeyPress={onKeyPressHandler}
              onChange={({ target }) =>
                dispatch({ type: 'SET_MESSAGETEXT', messageText: target.value })
              }
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
          <TextField
            id="outlined-basic"
            name="usermodal_username"
            className="usermodal_username"
            label="Username"
            variant="outlined"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
          <FormControl variant="outlined" className="usermodal_userroom">
            <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
            <Select
              native
              value={roomId}
              onChange={({ target }) =>
                dispatch({ type: 'SET_ROOM', roomId: target.value })
              }
              label="Room"
            >
              {chatRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomName}
                </option>
              ))}
            </Select>
          </FormControl>
          <input
            type="button"
            value="Enter"
            onClick={onUserEnterHandler}
            className="usermodal_submit"
            disabled={!userName || !roomId}
          />
        </div>
      )}
    </UserProvider>
  )
}

export default Home
