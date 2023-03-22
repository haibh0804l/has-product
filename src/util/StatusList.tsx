import { Status } from '../data/interface/Status'
import { HIDE, IGNORE_STT_DEFAULT } from './ConfigText'
import { statusData } from '../data/statusData'

const GetStatusIgnoreList = (
  userId: string,
  assigneeId: string,
  reporterId: string,
  currentStatus: string,
) => {
  const ignoreList: Status[] = IGNORE_STT_DEFAULT()
  //get current status id
  const currentStatusObj = statusData.filter(
    (element) => element.name.toLowerCase() === currentStatus.toLowerCase(),
  )
  if (currentStatusObj && currentStatus.length > 0)
    ignoreList.push({ id: currentStatusObj[0].id })

  if (userId === assigneeId) {
    if (assigneeId === reporterId) {
      if (currentStatus.toLowerCase() === 'In progress'.toLowerCase()) {
        ignoreList.push(
          {
            id: 5,
          },
          {
            id: 6,
          },
        )
      } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
        //nothing happen
      } else if (currentStatus.toLowerCase() === 'Completed'.toLowerCase()) {
        ignoreList.push(
          {
            id: 2,
          },
          {
            id: 3,
          },
        )
      } else if (currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()) {
        ignoreList.push(
          {
            id: 2,
          },
          {
            id: 3,
          },
        )
      }
    } else {
      if (currentStatus.toLowerCase() === 'In progress'.toLowerCase()) {
        ignoreList.push(
          {
            id: 5,
          },
          {
            id: 6,
          },
        )
      } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
        ignoreList.push(
          {
            id: 5,
          },
          {
            id: 6,
          },
        )
      } else if (
        currentStatus.toLowerCase() === 'Completed'.toLowerCase() ||
        currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
      ) {
        ignoreList.push(
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 5,
          },
          {
            id: 6,
          },
        )
      }
    }
  } else {
    if (userId === reporterId) {
      if (reporterId !== assigneeId) {
        if (currentStatus.toLowerCase() === 'In progress'.toLowerCase()) {
          ignoreList.push(
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 5,
            },
            {
              id: 6,
            },
          )
        } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
          //nothing happen
        } else if (
          currentStatus.toLowerCase() === 'Completed'.toLowerCase() ||
          currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          ignoreList.push(
            {
              id: 2,
            },
            {
              id: 3,
            },
          )
        }
      } else {
        if (currentStatus.toLowerCase() === 'In progress'.toLowerCase()) {
          ignoreList.push(
            {
              id: 5,
            },
            {
              id: 6,
            },
          )
        } else if (currentStatus.toLowerCase() === 'Done'.toLowerCase()) {
          //nothing happen
        } else if (
          currentStatus.toLowerCase() === 'Completed'.toLowerCase() ||
          currentStatus.toLowerCase() === 'Incompleted'.toLowerCase()
        ) {
          ignoreList.push(
            {
              id: 2,
            },
            {
              id: 3,
            },
          )
        }
      }
    }
  }

  return ignoreList
}

export default GetStatusIgnoreList
