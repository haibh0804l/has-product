import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  path: string
  name: string
}

const initialState: InitialState = {
  path: '/',
  name: '',
}

const routeSlice = createSlice({
  initialState: initialState,
  name: 'routes',
  reducers: {
    addPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload
    },
    addName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
  },
})

export const { addPath, addName } = routeSlice.actions
export default routeSlice.reducer
