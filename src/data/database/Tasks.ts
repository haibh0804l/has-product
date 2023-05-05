import { PriorityCategory, StatusCategory } from './Categories'
import { ProjectRepsonse } from './Project'
import { Users } from './Users'

export interface Tasks {
  _id?: string
  TaskName: string
  Description: string
  Priority: string
  PriorityNum?: number
  CreateDate: Date
  StartDate?: Date
  DueDate?: Date
  DoneDate?: Date
  CloseDate?: Date
  CancelDate?: Date
  Creator?: Users
  Assignee: Users[]
  Watcher: Users[]
  Tag: string[]
  Subtask?: any[]
  Attachment: any[]
  Comment: any[]
  Status: string
  Reporter: Users
  Reporters?: Users[]
  GroupPath: string
  __v?: number
  created?: boolean
  Score?: number
  ScoreComment?: string
  ScoreModifiedDate?: Date
  errorMessage?: string
  userId?: string
  userName?: string
  tasks?: any[]
  Project?: ProjectRepsonse
  ParentTask?: any
  SummaryReport?: string
  StatusCategory?: any
  PriorityCategory?: any
  AssigneeRead?: boolean
  ReporterRead?: boolean
  ReasonForClosed?: string
}
