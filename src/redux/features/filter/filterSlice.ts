import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterService } from '../../../data/filterService'
import {
  DateFilter,
  FilterInterface,
  FilterRequestWithType,
  FilterResponse,
} from '../../../data/interface/FilterInterface'
import { revertAll } from '../../../util/ConfigText'

type InitialState = {
  loading: boolean
  filterResponse: FilterResponse[]
  error: string
  filter: FilterInterface
  tabs?: string
}

const initialState: InitialState = {
  filter: {
    taskName: '',
    status: [],
    project: [],
    assignee: [],
    manager: [],
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
  tabs: sessionStorage.getItem('tab')?.toString()
    ? sessionStorage.getItem('tab')?.toString()
    : '1',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchFilterResult = createAsyncThunk(
  'filter/fetchFilterResult',
  async (params: FilterRequestWithType) => {
    const response = await FilterService(params)
    return response.data
  },
)

const filterSlice = createSlice({
  initialState: initialState,
  name: 'filter',
  reducers: {
    addTabs: (state, action: PayloadAction<string>) => {
      state.tabs = action.payload
    },
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
  addTabs,
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
