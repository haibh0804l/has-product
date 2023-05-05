import { Tasks } from '../database/Tasks'

export interface DateFilter {
  fromDate?: Date
  toDate?: Date
}

export interface FilterInterface {
  taskName?: string
  project?: string[]
  assignee?: string[]
  reporter?: string[]
  status?: string[]
  priority?: string[]
  manager: string[]
  dueDate?: DateFilter
  closeDate?: DateFilter
  completed?: boolean
  closedProject?: boolean
}

export interface FilterRequest {
  filter: FilterInterface
}
export interface FilterRequestWithType {
  filter: FilterInterface
  type: string
}

export interface FilterResponse {
  ProjectId?: string
  ProjectName?: string
  Status?: string
  Tasks?: Tasks[]
}
