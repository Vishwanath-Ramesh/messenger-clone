import React from 'react'

const UserContext = React.createContext({ userName: '' })

const useUser = () => {
  const { userName } = React.useContext(UserContext)

  const { Provider } = UserContext

  return { UserProvider: Provider, userName }
}

export default useUser
