import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  errorMessage: string
}

const initialState: InitialState = {
  errorMessage: '',
}

const errorSlice = createSlice({
  initialState: initialState,
  name: 'errorMessage',
  reducers: {
    serviceError: (state) => {
      state.errorMessage = ''
    },
    otherError: (state, action: PayloadAction<string>) => {
      state.errorMessage += action.payload
    },
  },
})

export const { serviceError, otherError } = errorSlice.actions
export default errorSlice.reducer
