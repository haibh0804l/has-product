import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { GetCommentByTaskId } from '../../../data/commentService'
import { CommentByTaskIdRepsonse } from '../../../data/database/Comment'

type InitialState = {
  loading: boolean
  comment: CommentByTaskIdRepsonse[]
  error: string
}

const initialState: InitialState = {
  loading: false,
  comment: [],
  error: '',
}

//Generated pending, fulfilled and rejected action type automatically
export const fetchComment = createAsyncThunk(
  'comment/fetchComment',
  async (taskId: string) => {
    const response = await GetCommentByTaskId(taskId)
    return response.data
  },
)

const commentSlice = createSlice({
  initialState: initialState,
  name: 'comment',
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComment.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchComment.fulfilled,
      (state, action: PayloadAction<CommentByTaskIdRepsonse[]>) => {
        state.loading = false
        state.comment = action.payload
        state.error = ''
      },
    )
    builder.addCase(fetchComment.rejected, (state, action) => {
      state.loading = false
      state.comment = []
      state.error = action.error.message
        ? action.error.message
        : 'Something went wrong'
    })
  },
})

export default commentSlice.reducer
