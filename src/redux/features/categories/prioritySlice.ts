import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FilterService } from '../../../data/services/filterService'
import {
  DateFilter,
  FilterInterface,
  FilterRequestWithType,
  FilterResponse,
} from '../../../data/interface/FilterInterface'
import { revertAll } from '../../../util/ConfigText'
import { DummyRequest } from '../../../data/services/dummyService'
import { AxiosResponse } from 'axios'
import {
  CategoriesRequest,
  PriorityCategory,
  StatusCategory,
} from '../../../data/database/Categories'
import { GetCategories } from '../../../data/services/categories'

type InitialState = {
  loading: boolean
  priority: PriorityCategory[]
  error: string
  priorityData: PriorityCategory[]
}

const initialState: InitialState = {
  priority: [],
  loading: false,
  error: '',
  priorityData: [],
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchPriority = createAsyncThunk(
  'categories/fetchPriority',
  async (params: CategoriesRequest) => {
    const respsonse = await GetCategories(params)
    /* const _re: AxiosResponse['data'] = [
      {
        _id: 1,
        Name: 'Urgent',
        Color: '#F43F5E',
        Level: 4,
      },
      {
        _id: 2,
        Name: 'High',
        Color: '#FACC15',
        Level: 3,
      },
      {
        _id: 3,
        Name: 'Medium',
        Color: '#2DD4BF',
        Level: 2,
      },
      {
        _id: 4,
        Name: 'Low',
        Color: '#4B5563',
        Level: 1,
      },
    ] */
    return respsonse.data
  },
)

const prioritySlice = createSlice({
  initialState: initialState,
  name: 'priority',
  reducers: {
    addPriorityData: (state, action: PayloadAction<PriorityCategory[]>) => {
      state.priorityData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPriority.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchPriority.fulfilled,
      (state, action: PayloadAction<PriorityCategory[]>) => {
        state.loading = false
        state.priority = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchPriority.rejected, (state, action) => {
      state.loading = false
      state.priority = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
    builder.addCase(revertAll, () => initialState)
  },
})

export const { addPriorityData } = prioritySlice.actions
export default prioritySlice.reducer
