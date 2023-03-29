import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SelectorValue } from '../../../data/interface/SelectorValue'
import { revertAll } from '../../../util/ConfigText'
import type { RangePickerProps } from 'antd/es/date-picker'

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

const initialState: InitialState = {
  taskName: '',
  assignee: [],
  reporter: [],
  project: [],
  status: [],
  priority: [],
  dueDate: null,
  closeDate: null,
}

const userValueSlice = createSlice({
  initialState: initialState,
  name: 'userValue',
  reducers: {
    addTaskNameValue: (state, action: PayloadAction<string>) => {
      state.taskName = action.payload
    },
    addAssigneeValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.assignee = action.payload
    },
    addReporterValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.reporter = action.payload
    },
    addProjectValue: (state, action: PayloadAction<SelectorValue[]>) => {
      state.project = action.payload
    },
    addStatusValue: (state, action: PayloadAction<string[]>) => {
      state.status = action.payload
    },
    addPriorityValue: (state, action: PayloadAction<string[]>) => {
      state.priority = action.payload
    },
    addDueDateValue: (
      state,
      action: PayloadAction<RangePickerProps['value']>,
    ) => {
      state.dueDate = action.payload
    },
    addCloseDateValue: (
      state,
      action: PayloadAction<RangePickerProps['value']>,
    ) => {
      state.closeDate = action.payload
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
})

export const {
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
