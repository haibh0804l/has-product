import axios from 'axios'
import { ASSIGNEE, REPORTER } from '../util/ConfigText'
import {
  FilterRequest,
  FilterRequestWithType,
} from './interface/FilterInterface'

export const FilterService = async (filterReq: FilterRequestWithType) => {
  let serviceUrl = ''
  if (filterReq.type === ASSIGNEE) {
    serviceUrl = process.env.REACT_APP_API_TASK_FILTERTASKFORASSIGNEE!
  } else if (filterReq.type === REPORTER) {
    serviceUrl = process.env.REACT_APP_API_TASK_FILTERTASKFOREPORTER!
  } else {
    serviceUrl = process.env.REACT_APP_API_TASK_FILTERTASK!
  }

  const _filterReq: FilterRequest = {
    filter: filterReq.filter,
  }

  const response = await axios.post(serviceUrl, JSON.stringify(_filterReq), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}
