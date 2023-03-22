import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  numOfTask: number
}

const initialState: InitialState = {
  numOfTask: 0,
}

const reportToMeTaskSlice = createSlice({
  initialState: initialState,
  name: 'reportToMeTask',
  reducers: {
    reportToMeTaskChange: (state, action: PayloadAction<number>) => {
      state.numOfTask = action.payload
    },
  },
})

export const { reportToMeTaskChange } = reportToMeTaskSlice.actions
export default reportToMeTaskSlice.reducer
