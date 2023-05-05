import { Status } from '../data/interface/Status'
import { HIDE, IGNORE_STT_DEFAULT, STATUS } from './ConfigText'
import { StatusCategory } from '../data/database/Categories'

const GetStatusIgnoreList = (
  userId: string,
  assigneeId: string,
  reporterId: string,
  currentStatus: string,
) => {
  const statusList = JSON.parse(
    localStorage.getItem('statusData')!,
  ) as StatusCategory[]
  const ignoreList: Status[] = []

  //get current status id
  if (assigneeId === '' || reporterId === '') {
    ignoreList.push(
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
      {
        id: 10,
      },
    )
    return ignoreList
  }

  const currentStatusObj = statusList.filter(
    (element) =>
      element.CategoryId == +currentStatus &&
      element.Type.toLowerCase() === STATUS.toLowerCase(),
  )

  if (currentStatusObj && currentStatusObj.length > 0) {
    ignoreList.push({ id: currentStatusObj[0].CategoryId! })
  }

  if (+currentStatus == 9 || +currentStatus == 10) {
    ignoreList.push(
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 9,
      },
      {
        id: 10,
      },
    )
  } else {
    if (userId === assigneeId) {
      if (assigneeId === reporterId) {
        if (+currentStatus == 1) {
          ignoreList.push(
            {
              id: 3,
            },
            {
              id: 4,
            },
          )
        } else if (+currentStatus == 2) {
          //nothing happen
        } else if (+currentStatus == 3) {
          ignoreList.push(
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 10,
            },
          )
        } else if (+currentStatus == 4) {
          ignoreList.push(
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 10,
            },
          )
        }
      } else {
        if (+currentStatus == 1) {
          ignoreList.push(
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 10,
            },
          )
        } else if (+currentStatus == 2) {
          ignoreList.push(
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 10,
            },
          )
        } else if (+currentStatus == 3 || +currentStatus == 4) {
          ignoreList.push(
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 10,
            },
          )
        }
      }
    } else {
      if (userId === reporterId) {
        if (reporterId !== assigneeId) {
          if (+currentStatus == 1) {
            ignoreList.push(
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 3,
              },
              {
                id: 4,
              },
            )
          } else if (+currentStatus == 2) {
            //nothing happen
          } else if (+currentStatus == 3 || +currentStatus == 4) {
            ignoreList.push(
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 10,
              },
            )
          }
        } else {
          if (+currentStatus == 1) {
            ignoreList.push(
              {
                id: 3,
              },
              {
                id: 4,
              },
            )
          } else if (+currentStatus == 2) {
            //nothing happen
          } else if (+currentStatus == 3 || +currentStatus == 4) {
            ignoreList.push(
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 10,
              },
            )
          }
        }
      } else {
        ignoreList.push(
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 4,
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
  }

  return ignoreList
}

export default GetStatusIgnoreList
