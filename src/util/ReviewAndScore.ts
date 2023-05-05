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
      if (+currentStatus === 1 && +postStatus === 2) {
      } else if (+currentStatus === 2) {
        //nothing happen
      } else if (+currentStatus === 3 && +postStatus === 4) {
      } else if (+postStatus === 3 && +currentStatus === 4) {
      }
    } else {
      scoreProps.showSCore = HIDE
      scoreProps.score = 0
      if (
        (+currentStatus === 1 && +postStatus === 2) ||
        (+postStatus === 1 && +currentStatus === 2)
      ) {
        //do nothing
      } else if (+currentStatus === 3 || +currentStatus === 4) {
      }
    }
  } else {
    if (userId === reporterId) {
      if (reporterId !== assigneeId) {
        if (+currentStatus === 1) {
          scoreProps.showSCore = HIDE
          scoreProps.score = 0
        } else if (+currentStatus === 2) {
          if (+postStatus === 1) {
            scoreProps.showSCore = HIDE
            scoreProps.score = DEFAULT_NOTPASS_SCORE
          } else if (+postStatus === 3) {
            scoreProps.showSCore = SHOW
            scoreProps.score = DEFAULT_PASS_SCORE
          } else if (+postStatus === 4) {
            scoreProps.showSCore = SHOW
            scoreProps.score = DEFAULT_NOTPASS_SCORE
          }
        } else if (+currentStatus === 3 && +postStatus === 4) {
          scoreProps.score = score!
          scoreProps.showSCore = SHOW
        } else if (+postStatus === 3 && +currentStatus === 4) {
          scoreProps.score = score!
          scoreProps.showSCore = SHOW
        }
      } else {
        if (+currentStatus === 1 && +postStatus === 2) {
          scoreProps.showSCore = HIDE
        } else if (+currentStatus === 2) {
          scoreProps.showSCore = HIDE
        } else if (+currentStatus === 3 && +postStatus === 4) {
          scoreProps.showSCore = HIDE
        } else if (+postStatus === 3 && +currentStatus === 4) {
          scoreProps.showSCore = HIDE
        }
      }
    }
  }

  return scoreProps
}

export default GetReviewAndScoreDisplay
