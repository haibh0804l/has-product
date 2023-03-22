import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  PersonalScoreRequest,
  PersonalScoreResponse,
  ScoreRankingRequest,
} from '../../../data/database/Report'
import { GetPersonalScore, GetScoreRanking } from '../../../data/reportService'

type InitialState = {
  loading: boolean
  score: PersonalScoreResponse[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  score: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchPersonalScore = createAsyncThunk(
  'report/fetchPersonalScore',
  async (params: PersonalScoreRequest) => {
    const response = await GetPersonalScore(params)
    return response.data
  },
)

const personalScoreSlice = createSlice({
  initialState: initialState,
  name: 'assigneeTask',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPersonalScore.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchPersonalScore.fulfilled,
      (state, action: PayloadAction<PersonalScoreResponse[]>) => {
        state.loading = false
        state.score = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchPersonalScore.rejected, (state, action) => {
      state.loading = false
      state.score = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default personalScoreSlice.reducer
