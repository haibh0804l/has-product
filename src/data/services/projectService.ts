import axios from 'axios'
import { getCookie } from 'typescript-cookie'
import { ProjectRepsonse, ProjectRequest } from '../database/Project'
import ServiceHeader from './header'

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
      headers: ServiceHeader(),
    },
  )
  return response
}

export const GetProject = async (
  managerId: string,
  type: string,
  status?: string,
) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETPROJECT!
  const response = await axios.post(
    serviceUrl,
    {
      userId: managerId,
      type: type,
      status: status,
    },
    {
      headers: ServiceHeader(),
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
      headers: ServiceHeader(),
    },
  )
  return response
}

export const GetTaskSummary = async (projectId: string) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETTASKSUMMARY!
  const response = await axios.post(
    serviceUrl,
    {
      projectId: projectId,
    },
    {
      headers: ServiceHeader(),
    },
  )
  return response
}

export const UpdateProject = async (
  projectId: string,
  projectRequest: ProjectRequest,
) => {
  let _projectRequest: ProjectRequest = JSON.parse(
    JSON.stringify(projectRequest),
  )
  _projectRequest.userId = getCookie('user_id')
  _projectRequest.userName = getCookie('user_name')

  const serviceUrl =
    process.env.REACT_APP_API_PROJECT_UPDATEPROJECT! + '/' + projectId
  const response = await axios.post(
    serviceUrl,
    JSON.stringify(_projectRequest),
    {
      headers: ServiceHeader(),
    },
  )
  return response
}

export const GetProjectById = async (projectId: string) => {
  const serviceUrl = process.env.REACT_APP_API_PROJECT_GETPROJECTBYID!
  const response = await axios.post(
    serviceUrl,
    { projectId: projectId },
    {
      headers: ServiceHeader(),
    },
  )
  return response
}
