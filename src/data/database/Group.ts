import { Users } from './Users'

export interface Group {
  _id: string
  Name?: string
  __v?: number
  Manager?: Users
}
