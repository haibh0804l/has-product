type Categories = {
  _id: number
  CategoryId: number
  Type: string
  Color: string
  Name: string
  Level: number
}

export type CategoriesRequest = {
  _id?: number
  categoryId?: number
  type?: string
  color?: string
  name?: string
}

export interface StatusCategory extends Categories {}

export interface PriorityCategory extends Categories {}

export interface Category extends Categories {}
