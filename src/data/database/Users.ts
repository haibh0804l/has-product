import { Group } from './Group'
import { Role } from './Role'

export interface Users {
  _id?: string
  UserName?: string
  Name?: string
  Role?: Role
  Department?: string
  Color?: string
  FirstName?: string
  LastName?: string
  Group?: Group[]
  message?: string
  code?: number
  __v?: number
}
