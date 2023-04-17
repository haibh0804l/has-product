import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Params } from '../../../data/interface/task'
import { Tasks } from '../../../data/database/Tasks'
import {
  GetAllTaskBaseOnUserReporterAxios,
  GetNotDoneTasksReporterAxios,
} from '../../../data/services/tasksService'

type InitialState = {
  loading: boolean
  tasks: Tasks[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  tasks: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchTasksReporter = createAsyncThunk(
  'users/fetchTasksReporter',
  async (params: Params) => {
    const response = await GetAllTaskBaseOnUserReporterAxios(
      params.serviceUrl,
      params.type,
    )
    return response.data
  },
)

const reporterTaskSlice = createSlice({
  initialState: initialState,
  name: 'reporterTask',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasksReporter.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTasksReporter.fulfilled,
      (state, action: PayloadAction<Tasks[]>) => {
        state.loading = false
        state.tasks = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchTasksReporter.rejected, (state, action) => {
      state.loading = false
      state.tasks = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default reporterTaskSlice.reducer
