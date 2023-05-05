import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SelectorValue } from '../../../data/interface/SelectorValue'
import { revertAll } from '../../../util/ConfigText'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'

type InitialStateObj = {
  filtered: InitialState
}

type InitialState = {
  taskName: string
  assignee: SelectorValue[]
  reporter: SelectorValue[]
  project: SelectorValue[]
  status: string[]
  priority: string[]
  dueDate: RangePickerProps['value']
  closeDate: RangePickerProps['value']
}

const initialState: InitialStateObj = {
  filtered: {
    taskName: '',
    assignee: [],
    reporter: [],
    project: [],
    status: [],
    priority: [],
    dueDate: null,
    closeDate: null,
  },
}

const userValueSlice = createSlice({
  initialState: initialState,
  name: 'userValue',
  reducers: {
    addTaskNameValue: (state, action: PayloadAction<string>) => {
      state.filtered.taskName = action.payload
    },
    addAssigneeValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.filtered.assignee = action.payload
    },
    addReporterValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.filtered.reporter = action.payload
    },
    addProjectValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.filtered.project = action.payload
    },
    addStatusValue: (state, action: PayloadAction<string[]>) => {
      state.filtered.status = action.payload
    },
    addPriorityValue: (state, action: PayloadAction<string[]>) => {
      state.filtered.priority = action.payload
    },
    addDueDateValue: (
      state,
      action: PayloadAction<RangePickerProps['value']>,
    ) => {
      state.filtered.dueDate = action.payload
    },
    addCloseDateValue: (
      state,
      action: PayloadAction<RangePickerProps['value']>,
    ) => {
      state.filtered.closeDate = action.payload
    },
    addUserValue: (state, action: PayloadAction<any>) => {
      state.filtered = action.payload
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
})

export const {
  addUserValue,
  addTaskNameValue,
  addAssigneeValue,
  addReporterValue,
  addProjectValue,
  addStatusValue,
  addPriorityValue,
  addDueDateValue,
  addCloseDateValue,
} = userValueSlice.actions
export default userValueSlice.reducer
