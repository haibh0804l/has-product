import { Tasks } from './Tasks'
import { Users } from './Users'

export interface ProjectRepsonse {
  _id?: string
  ProjectName?: string
  Assignee?: any[]
  Reporter?: any[]
  Manager?: any[]
  Tasks?: Tasks[]
  Customer?: any
  Description?: string
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
  createDate?: Date
  userId?: string
  userName?: string
  __v?: number
  status: string
  customer?: string
  description?: string
}

export interface Summary {
  Count: number
  Status: string
}

export interface TaskSummaryResponse {
  TotalTask: number
  Summary: Summary[]
}
