import { configureStore } from '@reduxjs/toolkit'
import cakeReducer from '../features/cake/cakeSlice'
import icecreamReducer from '../features/icecream/icecreamSlice'
import userReducer from '../features/user/userSlice'
import usersReducer from '../features/users/usersSlice'
import errorReducer from '../features/errors/errorSlice'
import assigneeTaskSliceReducer from '../features/tasks/assigneeTaskSlice'
import myTaskReducer from '../features/myTask/myTaskSlice'
import reportToMeTaskReducer from '../features/reportToMeTask/reportToMeTaskSlice'
import reporterTaskSliceReducer from '../features/tasks/reporterTaskSlice'
import historyReducer from '../features/history/historySlice'
import userInfoReducer from '../features/userInfo/userInfoSlice'
import scoreRankingReducer from '../features/report/scoreRankingSlice'
import personalScoreReducer from '../features/report/personalScoreSlice'
import commentReducer from '../features/comment/commentSlice'

const store = configureStore({
  reducer: {
    cake: cakeReducer,
    icecream: icecreamReducer,
    user: userReducer,
    users: usersReducer,
    errorMessage: errorReducer,
    assigneeTasks: assigneeTaskSliceReducer,
    reporterTasks: reporterTaskSliceReducer,
    myTaskList: myTaskReducer,
    reportToMeTaskList: reportToMeTaskReducer,
    history: historyReducer,
    userInfo: userInfoReducer,
    scoreRanking: scoreRankingReducer,
    personalScore: personalScoreReducer,
    comment: commentReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
