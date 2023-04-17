import { ScoreCompProp } from '../data/interface/ScoreCompProps'
import { HIDE, READONLY, SHOW } from './ConfigText'

const GetScoreReviewDisplay = (
  userId: string,
  assigneeId: string,
  reporterId: string,
  currentStatus: string,
) => {
  const scoreProps: ScoreCompProp = {
    score: 0,
    showSCore: '',
  }

  if (
    currentStatus.toLowerCase() === 'Completed'.toLowerCase() ||
    currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
  ) {
    if (userId === assigneeId) {
      if (assigneeId === reporterId) {
        scoreProps.showSCore = READONLY
      } else {
        scoreProps.showSCore = READONLY
      }
    } else {
      if (userId === reporterId) {
        if (reporterId !== assigneeId) {
          scoreProps.showSCore = SHOW
        } else {
          scoreProps.showSCore = READONLY
        }
      }
    }
  } else {
    scoreProps.showSCore = HIDE
  }
  return scoreProps
}

export default GetScoreReviewDisplay
