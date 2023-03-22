import axios from 'axios'
import { CommentRequest, CommentResponse } from './database/Comment'
import {
  PersonalScoreRequest,
  PersonalScoreResponse,
  ScoreRankingRequest,
  ScoreRankingResponse,
} from './database/Report'

export const GetPersonalScore = async (
  personalScoreReq: PersonalScoreRequest,
) => {
  const serviceUrl = process.env.REACT_APP_API_REPORT_GETPERSONALSCORE!
  const response = await axios.post(serviceUrl, personalScoreReq, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}
export const GetScoreRanking = async (scoreRankingReq: ScoreRankingRequest) => {
  const serviceUrl = process.env.REACT_APP_API_REPORT_GETSCORERANKING!
  const response = await axios.post(serviceUrl, scoreRankingReq, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}
