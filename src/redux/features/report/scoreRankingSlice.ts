import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  ScoreRankingRequest,
  ScoreRankingResponse,
} from '../../../data/database/Report'
import { GetScoreRanking } from '../../../data/services/reportService'

type InitialState = {
  loading: boolean
  score: ScoreRankingResponse[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  score: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchScoreRanking = createAsyncThunk(
  'report/fetchScoreRanking',
  async (score: ScoreRankingRequest) => {
    const response = await GetScoreRanking(score)
    return response.data
  },
)

const scoreRankingSlice = createSlice({
  initialState: initialState,
  name: 'assigneeTask',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchScoreRanking.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchScoreRanking.fulfilled,
      (state, action: PayloadAction<ScoreRankingResponse[]>) => {
        state.loading = false
        state.score = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchScoreRanking.rejected, (state, action) => {
      state.loading = false
      state.score = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default scoreRankingSlice.reducer
