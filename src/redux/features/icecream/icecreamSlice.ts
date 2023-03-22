import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cakeOrdered } from '../cake/cakeSlice'

type InitialState = {
  numOfIceCreams: number
}

const initialState: InitialState = {
  numOfIceCreams: 20,
}

const iceCreamSlice = createSlice({
  initialState: initialState,
  name: 'icecream',
  reducers: {
    iceCreamOrdered: (state) => {
      state.numOfIceCreams--
    },
    iceCreamRestocked: (state, action: PayloadAction<number>) => {
      state.numOfIceCreams += action.payload
    },
  },
  /*  extraReducers: {
    ['cake/cakeOrdered']: (state) => {
      state.numOfIceCreams--
    },
  }, */
  extraReducers: (builder) => {
    builder.addCase(cakeOrdered, (state) => {
      state.numOfIceCreams--
    })
  },
})

export const { iceCreamOrdered, iceCreamRestocked } = iceCreamSlice.actions
export default iceCreamSlice.reducer
