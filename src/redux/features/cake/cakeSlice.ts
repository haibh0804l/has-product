import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  numOfCakes: number
}

const initialState: InitialState = {
  numOfCakes: 10,
}

const cakeSlice = createSlice({
  initialState: initialState,
  name: 'cake',
  reducers: {
    cakeOrdered: (state) => {
      state.numOfCakes--
    },
    cakeRestocked: (state, action: PayloadAction<number>) => {
      state.numOfCakes += action.payload
    },
  },
})

export const { cakeOrdered, cakeRestocked } = cakeSlice.actions
export default cakeSlice.reducer
