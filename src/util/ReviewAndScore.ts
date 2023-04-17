import { ScoreCompProp } from '../data/interface/ScoreCompProps'
import { Status } from '../data/interface/Status'
import {
  DEFAULT_NOTPASS_SCORE,
  DEFAULT_PASS_SCORE,
  HIDE,
  SHOW,
} from './ConfigText'

const GetReviewAndScoreDisplay = (
  userId: string,
  assigneeId: string,
  reporterId: string,
  currentStatus: string,
  postStatus: string,
  score?: number,
) => {
  const scoreProps: ScoreCompProp = {
    score: 0,
    showSCore: '',
  }

  if (userId === assigneeId) {
    if (assigneeId === reporterId) {
      scoreProps.showSCore = HIDE
      scoreProps.score = 0
      if (
        currentStatus.toLowerCase() === 'In progress'.toLowerCase() &&
        postStatus.toLowerCase() === 'Done'.toLowerCase()
      ) {
      } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
        //nothing happen
      } else if (
        currentStatus.toLowerCase() === 'Completed'.toLowerCase() &&
        postStatus.toLowerCase() === 'Incompleted'.toLowerCase()
      ) {
      } else if (
        postStatus.toLowerCase() === 'Completed'.toLowerCase() &&
        currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
      ) {
      }
    } else {
      scoreProps.showSCore = HIDE
      scoreProps.score = 0
      if (
        (currentStatus.toLowerCase() === 'In progress'.toLowerCase() &&
          postStatus.toLowerCase() === 'Done'.toLowerCase()) ||
        (postStatus.toLowerCase() === 'In progress'.toLowerCase() &&
          currentStatus.toLowerCase() === 'Done'.toLowerCase())
      ) {
        //do nothing
      } else if (
        currentStatus.toLowerCase() === 'Completed'.toLowerCase() ||
        currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
      ) {
      }
    }
  } else {
    if (userId === reporterId) {
      if (reporterId !== assigneeId) {
        if (currentStatus.toLowerCase() === 'In progress'.toLowerCase()) {
          scoreProps.showSCore = HIDE
          scoreProps.score = 0
        } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
          if (postStatus.toLowerCase() === 'In progress'.toLowerCase()) {
            scoreProps.showSCore = HIDE
            scoreProps.score = DEFAULT_NOTPASS_SCORE
          } else if (postStatus.toLowerCase() === 'Completed'.toLowerCase()) {
            scoreProps.showSCore = SHOW
            scoreProps.score = DEFAULT_PASS_SCORE
          } else if (postStatus.toLowerCase() === 'Incompleted'.toLowerCase()) {
            scoreProps.showSCore = SHOW
            scoreProps.score = DEFAULT_NOTPASS_SCORE
          }
        } else if (
          currentStatus.toLowerCase() === 'Completed'.toLowerCase() &&
          postStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          scoreProps.score = score!
          scoreProps.showSCore = SHOW
        } else if (
          postStatus.toLowerCase() === 'Completed'.toLowerCase() &&
          currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          scoreProps.score = score!
          scoreProps.showSCore = SHOW
        }
      } else {
        if (
          currentStatus.toLowerCase() === 'In progress'.toLowerCase() &&
          postStatus.toLowerCase() === 'Done'.toLowerCase()
        ) {
          scoreProps.showSCore = HIDE
        } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
          scoreProps.showSCore = HIDE
        } else if (
          currentStatus.toLowerCase() === 'Completed'.toLowerCase() &&
          postStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          scoreProps.showSCore = HIDE
        } else if (
          postStatus.toLowerCase() === 'Completed'.toLowerCase() &&
          currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          scoreProps.showSCore = HIDE
        }
      }
    }
  }

  return scoreProps
}

export default GetReviewAndScoreDisplay
