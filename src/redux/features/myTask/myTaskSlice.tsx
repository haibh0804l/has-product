import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  numOfTask: number
}

const initialState: InitialState = {
  numOfTask: 0,
}

const myTaskSlice = createSlice({
  initialState: initialState,
  name: 'myTask',
  reducers: {
    myTaskChange: (state, action: PayloadAction<number>) => {
      state.numOfTask = action.payload
    },
  },
})

export const { myTaskChange } = myTaskSlice.actions
export default myTaskSlice.reducer
