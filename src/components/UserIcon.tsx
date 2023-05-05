import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Button, Tag, Tooltip } from 'antd'
import { Users } from '../data/database/Users'

interface User {
  username?: React.ReactNode
  userColor?: string
  tooltipName?: string
  userInfo?: Users
  size?: string
}

//const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
const GapList = [4, 3, 2, 1]

const UserIcon: React.FC<User> = ({
  username,
  userColor,
  tooltipName,
  userInfo,
  size,
}) => {
  let user = username
  const [gap, setGap] = useState(GapList[0])

  const changeGap = () => {
    const index = GapList.indexOf(gap)
    setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0])
  }

  const firstNameLetter = userInfo?.FirstName?.trim()
    .substring(0, 1)
    .toUpperCase()
  const lastNameLetter = userInfo?.LastName?.trim()
    .substring(0, 1)
    .toUpperCase()
  user = lastNameLetter + '' + firstNameLetter
  return (
    <>
      <Tooltip title={tooltipName} placement="top">
        <Avatar
          style={{
            backgroundColor:
              userColor !== ''
                ? userColor
                : userInfo?.Color /* , verticalAlign: 'middle' */,
          }}
          size={
            size === undefined
              ? 'default'
              : { xs: 24, sm: 32, md: 40, lg: 64, xl: 40, xxl: 65 }
          }
          /*gap={gap} */
        >
          {user}
        </Avatar>
      </Tooltip>
    </>
  )
}

export default UserIcon
