import React, { useCallback, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { CommentRequest } from '../data/database/Comment'
import ObjectID from 'bson-objectid'
import { SearchBar } from '../components/filter/SearchBar'

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
  return <h1>Hello</h1>
}

export default SettingPage
