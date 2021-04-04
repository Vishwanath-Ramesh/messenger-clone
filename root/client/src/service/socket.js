import { io } from 'socket.io-client'

import configs from '../configs/configs'

const socketclient = io(configs.serverConfig.baseURL)

export default { socketclient }
