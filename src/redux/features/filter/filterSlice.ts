import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCookie } from 'typescript-cookie'
import { FilterService } from '../../../data/filterService'
import {
  DateFilter,
  FilterInterface,
  FilterRequest,
  FilterResponse,
} from '../../../data/interface/FilterInterface'
import { revertAll } from '../../../util/ConfigText'

type InitialState = {
  loading: boolean
  filterResponse: FilterResponse[]
  error: string
  filter: FilterInterface
}

const initialState: InitialState = {
  filter: {
    taskName: '',
    status: [],
    project: [],
    assignee: [],
    manager: [getCookie('user_id')!],
    reporter: [],
    dueDate: {
      fromDate: undefined,
      toDate: undefined,
    },
    priority: [],
    closeDate: {},
    completed: false,
  },
  loading: false,
  filterResponse: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchFilterResult = createAsyncThunk(
  'filter/fetchFilterResult',
  async (params: FilterRequest) => {
    const response = await FilterService(params)
    return response.data
  },
)

const filterSlice = createSlice({
  initialState: initialState,
  name: 'filter',
  reducers: {
    addManager: (state, action: PayloadAction<string[]>) => {
      state.filter.manager = action.payload
    },
    addTaskName: (state, action: PayloadAction<string>) => {
      state.filter.taskName = action.payload
    },
    addProject: (state, action: PayloadAction<string[]>) => {
      state.filter.project = action.payload
    },
    addAssignee: (state, action: PayloadAction<string[]>) => {
      state.filter.assignee = action.payload
    },
    addReporter: (state, action: PayloadAction<string[]>) => {
      state.filter.reporter = action.payload
    },
    addStatus: (state, action: PayloadAction<string[]>) => {
      state.filter.status = action.payload
    },
    addPriority: (state, action: PayloadAction<string[]>) => {
      state.filter.priority = action.payload
    },
    addDueDate: (state, action: PayloadAction<DateFilter>) => {
      state.filter.dueDate = action.payload
    },
    addClosedDate: (state, action: PayloadAction<DateFilter>) => {
      state.filter.closeDate = action.payload
    },
    addCompleted: (state, action: PayloadAction<boolean>) => {
      state.filter.completed = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFilterResult.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchFilterResult.fulfilled,
      (state, action: PayloadAction<FilterResponse[]>) => {
        state.loading = false
        state.filterResponse = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchFilterResult.rejected, (state, action) => {
      state.loading = false
      state.filterResponse = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
    builder.addCase(revertAll, () => initialState)
  },
})

export const {
  addManager,
  addTaskName,
  addProject,
  addAssignee,
  addReporter,
  addCompleted,
  addDueDate,
  addClosedDate,
  addStatus,
  addPriority,
} = filterSlice.actions
export default filterSlice.reducer
