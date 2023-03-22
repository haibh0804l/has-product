import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { CommentRequest } from '../data/database/Comment'
import ObjectID from 'bson-objectid'

const socket = io(process.env.REACT_APP_SOCKET!, {
  reconnectionDelayMax: 10000,
  /* auth: {
    token: '123',
  },
  query: {
    'my-key': 'my-value',
  }, */
})
const SettingPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastPong, setLastPong] = useState('')
  const [count, setCount] = useState(0)

  const sendPing = () => {
    //socket.emit('ping')
    //socket.on('messageData', (data) => console.log(data))
    //socket.emit('message', 'Testing')
    const comment: CommentRequest = {
      taskId: '64083c3c7ee88afeff69f122',
      userId: '63bbf13e2facab213077dc03',
      comment: 'Test comment ' + ObjectID(new Date().getTime()).toHexString(),
      createdDate: new Date(),
    }
    socket.emit('addComment', comment)
  }

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <p>Last pong: {lastPong || '-'}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
  )
}

export default SettingPage
