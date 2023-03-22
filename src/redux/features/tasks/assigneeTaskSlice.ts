import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Params } from '../../../data/interface/task'
import { GetAllTaskBaseOnUserAssigneeAxios } from '../../../data/tasksService'
import { Tasks } from '../../../data/database/Tasks'

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
export const fetchTasksAssignee = createAsyncThunk(
  'users/fetchTasksAssignee',
  async (params: Params) => {
    const response = await GetAllTaskBaseOnUserAssigneeAxios(
      params.serviceUrl,
      params.type,
    )
    return response.data
  },
)

const assigneeTaskSlice = createSlice({
  initialState: initialState,
  name: 'assigneeTask',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasksAssignee.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTasksAssignee.fulfilled,
      (state, action: PayloadAction<Tasks[]>) => {
        state.loading = false
        state.tasks = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchTasksAssignee.rejected, (state, action) => {
      state.loading = false
      state.tasks = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default assigneeTaskSlice.reducer
