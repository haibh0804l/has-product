import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
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
import filterReducer from '../features/filter/filterSlice'
import userValueReducer from '../features/userInfo/userValueSlice'
import trustScoreReducer from '../features/report/trustScoreSlice'
import routeReducer from '../features/routes/routeSlice'
import { persistReducer, persistStore } from 'redux-persist'

/* const persistConfig = {
  key: 'root',
  storage,
} */

const reducers = combineReducers({
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
  filter: filterReducer,
  userValue: userValueReducer,
  trustScore: trustScoreReducer,
  route: routeReducer,
})

/* const persistedReducers = persistReducer(persistConfig, reducers) */

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
    filter: filterReducer,
    userValue: userValueReducer,
    trustScore: trustScoreReducer,
    route: routeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'filter/addDueDate',
          'filter/addClosedDate',
          'userValue/addDueDateValue',
          'userValue/addCloseDateValue',
        ],
        // Ignore these field paths in all actions
        //ignoredActionPaths: ['userValue.filter.dueDate.0'],

        // Ignore these paths in the state
        ignoredPaths: [
          'filter.filter.dueDate.fromDate',
          'filter.filter.dueDate.toDate',
          'filter.filter.closeDate.fromDate',
          'filter.filter.closeDate.toDate',
          'userValue.filtered.dueDate.0',
          'userValue.filtered.dueDate.1',
          'userValue.filtered.closeDate.0',
          'userValue.filtered.closeDate.1',
        ],
      },
    }),
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
/* export const persistor = persistStore(store) */
