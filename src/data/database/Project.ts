import { Tasks } from './Tasks'
import { Users } from './Users'

export interface ProjectRepsonse {
  _id?: string
  ProjectName?: string
  Assignee?: any[]
  Reporter?: any[]
  Manager?: any[]
  Tasks?: Tasks[]
  __v?: number
}

export interface ProjectRequest {
  _id?: string
  projectName?: string
  assignee?: any[]
  reporter?: any[]
  manager?: any[]
  creator?: string
  creatorName?: string
  createDate: Date
  __v?: number
}
