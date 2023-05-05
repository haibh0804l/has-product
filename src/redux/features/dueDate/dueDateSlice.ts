import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Users } from '../../../data/database/Users'

type InitialState = {
  mainTaskDueDateString: string | null
  subTaskDueDateString: string | null
}

const initialState: InitialState = {
  mainTaskDueDateString: '',
  subTaskDueDateString: '',
}

const dueDateSlice = createSlice({
  initialState: initialState,
  name: 'dueDate',
  reducers: {
    addMainTaskDueDate: (state, action: PayloadAction<string | null>) => {
      state.mainTaskDueDateString = action.payload
    },
    addSubtaskDueDate: (state, action: PayloadAction<string | null>) => {
      state.subTaskDueDateString = action.payload
    },
  },
})

export const { addMainTaskDueDate, addSubtaskDueDate } = dueDateSlice.actions
export default dueDateSlice.reducer
