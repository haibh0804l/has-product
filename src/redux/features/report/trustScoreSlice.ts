import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  PersonalScoreRequest,
  PersonalScoreResponse,
  ScoreRankingRequest,
  TrustScoreRequest,
  TrustScoreResponse,
} from '../../../data/database/Report'
import {
  GetPersonalScore,
  GetScoreRanking,
  GetTrustScore,
} from '../../../data/reportService'

type InitialState = {
  loading: boolean
  score: TrustScoreResponse[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  score: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchTrustScore = createAsyncThunk(
  'report/fetchTrustScore',
  async (params: TrustScoreRequest) => {
    const response = await GetTrustScore(params)
    return response.data
  },
)

const trustScoreSlice = createSlice({
  initialState: initialState,
  name: 'trustScore',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTrustScore.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTrustScore.fulfilled,
      (state, action: PayloadAction<TrustScoreResponse[]>) => {
        state.loading = false
        state.score = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchTrustScore.rejected, (state, action) => {
      state.loading = false
      state.score = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default trustScoreSlice.reducer
