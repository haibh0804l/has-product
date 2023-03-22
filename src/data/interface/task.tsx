export interface Task {
  id: string
  task_name: string
  priority: string
  start_date: string
  due_date: string
  status: string
  folder_path: string
  reporter_id: string
}

export type Params = {
  serviceUrl: string
  type: string
  userId?: string
}
