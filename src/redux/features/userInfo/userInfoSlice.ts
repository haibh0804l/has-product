import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Users } from '../../../data/database/Users'

type InitialState = {
  user: Users
}

const initialState: InitialState = {
  user: {},
}

const userInfoSlice = createSlice({
  initialState: initialState,
  name: 'userInfo',
  reducers: {
    setUserInfo: (state, action: PayloadAction<Users>) => {
      state.user = action.payload
    },
  },
})

export const { setUserInfo } = userInfoSlice.actions
export default userInfoSlice.reducer
