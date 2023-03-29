import { createAction } from '@reduxjs/toolkit'
import { getCookie } from 'typescript-cookie'
import { Role } from '../data/database/Role'
import { Users } from '../data/database/Users'
import { Status } from '../data/interface/Status'

//Component mode
export const UPDATE_MODE = 'UPDATE'
export const INSERT_MODE = 'INSERT'

//status
export const DEFAULT_STT = 'In progress'

//Login text
export const LOGIN_ERROR = 'Sai tên đăng nhập hoặc mật khẩu'
export const LOGIN_SERVICE_ERROR =
  'Xảy ra lỗi hệ thống, xin vui lòng thử lại sau'
export const UPDATE_SUCCESS = 'Update thành công'
export const UPDATE_FAIL = 'Update thất bại'

//ignore status
export function IGNORE_STT_DEFAULT() {
  let ignoreStt: Status[] = [
    {
      id: 1,
    },
    {
      id: 4,
    },
  ]

  /* const role: Role = JSON.parse(getCookie('userInfo') as string).Role
  if (role.Level >= 5) {
    ignoreStt.push(
      {
        id: 6,
      },
      {
        id: 5,
      },
    )
  } */
  return ignoreStt
}

//ignore statues of newly created subtasks in task details
export function IGNORE_STT_DEFAULT_TASK_DETAIL() {
  let ignoreStt: Status[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
  ]

  /* const role: Role = JSON.parse(getCookie('userInfo') as string).Role
  if (role.Level >= 5) {
    ignoreStt.push(
      {
        id: 6,
      },
      {
        id: 5,
      },
    )
  } */
  return ignoreStt
}

//etc
export const SHOW = 'show'
export const HIDE = 'hide'
export const READONLY = 'readonly'
export const DEFAULT_PASS_SCORE = 10
export const DEFAULT_NOTPASS_SCORE = 0
export const MIN_SCORE = 0
export const MAX_SCORE = 15
export const ZERO_SCORE_TEXT = 'Every effort counts'
export const BAD_SCORE_TEXT = 'You need to make more effort'
export const GOOD_SCORE_TEXT = 'Keep up good work'
export const BIG_SCORE_TEXT = 'Great effort'
export const PROJECT = 'project'
export const ASSIGNEE = 'assignee'
export const MANAGER = 'manager'
export const REPORTER = 'reporter'
export const SELECT = 'select'
export const STATUS = 'status'
export const CLOSEDTASK = 'closed task'
export const TASKNAME = 'TaskName'
export const SEARCH = 'Search'
export const userDefault: Users = {
  _id: 'default',
  UserName: 'default',
  Name: 'string',
  Color: 'string',
  FirstName: 'string',
  LastName: 'string',
  message: 'string',
  code: 0,
  __v: 0,
}

export const revertAll = createAction('REVERT_ALL')
