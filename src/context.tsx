import { createContext } from 'react'
import io from 'socket.io-client'
import { GetCategories } from './data/services/categories'

export const socket = io(process.env.REACT_APP_SOCKET!, {
  reconnectionDelayMax: 10000,
  /* auth: {
    token: '123',
  },
  query: {
    'my-key': 'my-value',
  }, */
})

export const SocketContext = createContext(socket)
