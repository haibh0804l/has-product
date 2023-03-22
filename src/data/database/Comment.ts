import { Users } from './Users'

export interface CommentRequest {
  taskId: string
  userId: string
  comment: string
  createdDate: Date
}

export interface CommentResponse {
  Comment?: string
  User?: Users
  CreatedDate?: Date
  Attachment?: []
  _id?: string
  __v?: number
}

export interface CommentByTaskIdRepsonse {
  _id: string
  Comment: CommentResponse[]
}
