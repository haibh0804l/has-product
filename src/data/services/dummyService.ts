import axios from 'axios'
import ServiceHeader from './header'

export const DummyRequest = async () => {
  const serviceUrl = process.env.REACT_APP_API_COMMENT_ADDCOMMENT!
  const response = await axios.get(serviceUrl, {
    headers: ServiceHeader(),
  })
  return response
}
