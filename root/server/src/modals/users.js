const users = []

function getAllUsers(roomId) {
  if (!roomId) return []

  return users.filter((user) => user.roomId === roomId)
}

function getUserById(userId) {
  return users.find((user) => user.id === userId)
}

function isUserExists(userName) {
  return users.findIndex((user) => user.userName === userName) >= 0
}

function removeUserById(userId) {
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex >= 0) users.splice(userIndex, 1)
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    if (!user.userName)
      return reject(new Error('Username should not be empty.'))

    if (isUserExists(user.userName))
      return reject(new Error('Username already exists'))

    const newUser = {
      id: user.id,
      userName: user.userName,
      roomId: user.roomId,
    }
    users.push(newUser)
    return resolve(newUser)
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  isUserExists,
  removeUserById,
  createUser,
}
