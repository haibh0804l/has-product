import axios from 'axios'
import { ProjectRepsonse, ProjectRequest } from './database/Project'

export const AddProject = async (project: ProjectRequest) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_ADD!
  const response = await axios.post(serviceUrl, JSON.stringify(project), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}

export const GetUsersByManager = async (
  userId: string,
  userType: string,
  type: string,
) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETUSERS!
  const response = await axios.post(
    serviceUrl,
    {
      userId: userId,
      userType: userType,
      type: type,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response
}

export const GetProject = async (managerId: string, type: string) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETPROJECT!
  const response = await axios.post(
    serviceUrl,
    {
      userId: managerId,
      type: type,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response
}

export const GetUsersByProject = async (projectId: string, type: string) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETUSERSBYPROJECT!
  const response = await axios.post(
    serviceUrl,
    {
      project: projectId,
      type: type,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response
}
