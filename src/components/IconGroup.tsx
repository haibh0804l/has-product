import React from 'react'
import { Avatar } from 'antd'
import { Users } from '../data/database/Users'
import UserIcon from './UserIcon'

interface InputList {
  inputList: Users[]
  maxCount?: number
}

const IconGroup: React.FC<InputList> = ({ inputList, maxCount }) => {
  return (
    <>
      <Avatar.Group
        maxCount={maxCount ? maxCount : 2}
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        {inputList.map((d) => {
          return (
            <UserIcon
              username={d.Name}
              userColor={d.Color}
              tooltipName={d.UserName}
              userInfo={d}
              key={d._id}
            />
          )
        })}
      </Avatar.Group>
    </>
  )
}

export default IconGroup
