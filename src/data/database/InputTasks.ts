import { ProjectRepsonse } from './Project'
import { Tasks } from './Tasks'
import { Users } from './Users'

export interface InputTasks {
  _id?: string
  TaskName?: string
  Description?: string
  Priority?: string
  CreateDate?: Date
  StartDate?: Date
  DueDate?: Date
  DoneDate?: Date
  CloseDate?: Date
  Assignee?: Users[]
  Watcher?: Users[]
  Tag?: string[]
  Subtask?: string[]
  Attachment?: any[]
  Comment?: any[]
  Status?: string
  Reporter?: Users
  GroupPath?: string
  __v?: number
  Score?: number
  ScoreComment?: string
  ScoreModifiedDate?: Date
  userId?: string
  userName?: string
  tasks?: any[]
  Project?: ProjectRepsonse
  ParentTask?: string
  SummaryReport?: string
}
