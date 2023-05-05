import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '../../../util/ConfigText'
import {
  CategoriesRequest,
  StatusCategory,
} from '../../../data/database/Categories'
import { GetCategories } from '../../../data/services/categories'
import storage from 'redux-persist/es/storage'
import persistReducer from 'redux-persist/es/persistReducer'

type InitialState = {
  statusData: StatusCategory[]
  loading: boolean
  status: StatusCategory[]
  error: string
}

const initialState: InitialState = {
  status: [],
  statusData: [],
  loading: false,
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchStatus = createAsyncThunk(
  'categories/fetchStatus',
  async (params: CategoriesRequest) => {
    const respsonse = await GetCategories(params)
    return respsonse.data
  },
)

const statusSlice = createSlice({
  initialState: initialState,
  name: 'status',
  reducers: {
    addStatusData: (state, action: PayloadAction<StatusCategory[]>) => {
      state.statusData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStatus.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchStatus.fulfilled,
      (state, action: PayloadAction<StatusCategory[]>) => {
        state.loading = false
        state.status = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchStatus.rejected, (state, action) => {
      state.loading = false
      state.status = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
    builder.addCase(revertAll, () => initialState)
  },
})
export const { addStatusData } = statusSlice.actions
export default statusSlice.reducer
