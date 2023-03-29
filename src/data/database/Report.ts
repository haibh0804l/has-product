export interface PersonalScoreRequest {
  userId: string
  department?: string
  baseOnWeek?: number
  baseOnMonth?: number
  baseOnYear?: number
  fromDate?: Date
  toDate?: Date
}

export interface PersonalScoreResponse {
  _id?: string
  Department?: string
  FirstName?: string
  LastName?: string
  TotalScore?: number
  Rank?: number
  UserCount?: number
}

export interface ScoreRankingRequest {
  department: string
  baseOnWeek?: number
  baseOnMonth?: number
  baseOnYear?: number
  fromDate?: Date
  toDate?: Date
}

export interface ScoreRankingResponse {
  _id?: string
  Department: string
  FirstName: string
  LastName: string
  TotalScore?: number
  Rank?: number
  UserCount?: number
}

export interface TrustScoreRequest {
  assignee?: string
  reporter?: string
}

export interface TrustScoreResponse {
  Score: number
  Department: string
  FirstName: string
  LastName: string
  Rank: number
}
