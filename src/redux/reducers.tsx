import { Users } from '../data/database/Users'
import {
  FETCH_USERS_FAILED,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
} from './actions'

interface ComponentState {
  loading: boolean
  user: Users
  error: string
}

const INIT_STATE: ComponentState = {
  loading: true,
  user: {},
  error: '',
}

export default (state: ComponentState, action: any) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: '',
      }

    case FETCH_USERS_FAILED:
      return {
        loading: false,
        users: [],
        error: action.payload,
      }
  }
}
