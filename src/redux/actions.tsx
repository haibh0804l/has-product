import { Users } from '../data/database/Users'

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
export const FETCH_USERS_SUCCESS = 'FECTH_USERS_SUCCESS'
export const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED'

const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  }
}

const fetchUserSuccess = (users: Users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  }
}

const fetchUserFailed = (error: any) => {
  return {
    type: FETCH_USERS_FAILED,
    payload: error,
  }
}
