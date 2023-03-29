import { Select, Space } from 'antd'
import { useEffect } from 'react'
import { Users } from '../data/database/Users'
import UserIcon from './UserIcon'

interface Input {
  users: Users[]
}

interface CompInput {
  user: Users
}

const { Option } = Select

const Comp: React.FC<CompInput> = ({ user }) => {
  return (
    <Option value={user._id} label={user.UserName}>
      <Space direction="horizontal" size="small" align="center">
        <UserIcon
          username={user.Name}
          userColor={user.Color}
          tooltipName={user.UserName}
          userInfo={user}
        />
        <h4>{user.Name}</h4>
      </Space>
    </Option>
  )
}

const UserOptionsList: React.FC<Input> = ({ users }) => {
  return (
    <>
      {users.map((element) => {
        return <Comp user={element} />
      })}
    </>
  )
}

export default UserOptionsList
