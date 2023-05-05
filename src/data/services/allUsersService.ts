import axios from 'axios'
import { Users } from '../database/Users'
import ServiceHeader from './header'

const GetAllUsers = async (serviceUrl: string) => {
  let output: Users[] = []
  await axios.get(serviceUrl).then((res) => {
    output = JSON.parse(JSON.stringify(res.data))
  })
  return output
}

const GetUserByType = async (
  serviceUrl: string,
  type: string,
  userId?: string,
) => {
  serviceUrl = process.env.REACT_APP_API_USERS_GETREPORTERORASSIGNEE!
  let output: Users[] = []
  await axios
    .post(
      serviceUrl,
      {
        userId: userId,
        type: type,
      },
      {
        headers: ServiceHeader(),
      },
    )
    .then((res) => {
      if (res.data !== '') {
        output = JSON.parse(JSON.stringify(res.data))
      }
      return output
    })
    .catch(function (error) {
      console.log(error)
    })

  return output
}

const GetUserByTypeAxios = async (
  serviceUrl: string,
  type: string,
  userId?: string,
) => {
  serviceUrl = process.env.REACT_APP_API_USERS_GETREPORTERORASSIGNEE!
  const response = await axios.post(
    serviceUrl,
    {
      userId: userId,
      type: type,
    },
    {
      headers: ServiceHeader(),
    },
  )
  return response
}

const GetAllFilter = async (type: string, userName?: string) => {
  const serviceUrl = process.env.REACT_APP_API_USERS_GETALLFILTER!
  const response = await axios.post(
    serviceUrl,
    {
      type: type,
      userName: userName,
    },
    {
      headers: ServiceHeader(),
    },
  )
  return response.data
}

export { GetAllUsers, GetUserByType, GetUserByTypeAxios, GetAllFilter }
