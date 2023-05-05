import axios from 'axios'
import ServiceHeader from './header'
import { CategoriesRequest } from '../database/Categories'

export const GetCategories = async (req: CategoriesRequest) => {
  const serviceUrl = process.env.REACT_APP_API_CATEGORIES_FILTER!
  const response = await axios.post(serviceUrl, JSON.stringify(req), {
    headers: ServiceHeader(),
  })
  return response
}
