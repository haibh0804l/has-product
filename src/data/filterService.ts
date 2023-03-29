import axios from 'axios'
import { FilterRequest } from './interface/FilterInterface'

export const FilterService = async (filterReq: FilterRequest) => {
  const serviceUrl = process.env.REACT_APP_API_TASK_FILTERTASK!
  const response = await axios.post(serviceUrl, JSON.stringify(filterReq), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}
