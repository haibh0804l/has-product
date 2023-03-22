import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { GetUserByTypeAxios } from '../../../data/allUsersService'
import { Users } from '../../../data/database/Users'
import { Params } from '../../../data/interface/task'
import type { MenuProps } from 'antd'

type InitialState = {
  loading: boolean
  users: Users[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  users: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: Params) => {
    const response = await GetUserByTypeAxios(
      params.serviceUrl,
      params.type,
      params.userId,
    )
    return response.data
  },
)

const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<Users[]>) => {
        state.loading = false
        state.users = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default userSlice.reducer
