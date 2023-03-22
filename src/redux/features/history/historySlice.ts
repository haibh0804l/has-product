import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { History } from '../../../data/database/History'
import { Tasks } from '../../../data/database/Tasks'

type InitialState = {
  loading: boolean
  history: History[]
  error: string
}

type HistoryRequest = {
  collection?: string
  documentId?: string
  fromDate?: string
  toDate?: string
}

const initialState: InitialState = {
  loading: false,
  history: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchHistory = createAsyncThunk(
  'users/fetchHistory',
  async (params: HistoryRequest) => {
    const serviceUrl = process.env.REACT_APP_API_HISTORIES_GETALL!
    const response = await axios.post(serviceUrl, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  },
)

const historySlice = createSlice({
  initialState: initialState,
  name: 'assigneeTask',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchHistory.fulfilled,
      (state, action: PayloadAction<History[]>) => {
        state.loading = false
        state.history = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchHistory.rejected, (state, action) => {
      state.loading = false
      state.history = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default historySlice.reducer
