import { Users } from './database/Users'
import { MenuProps, Space } from 'antd'
import UserIcon from '../components/UserIcon'

export const userMenu = (users: Users[]) => {
  const items: MenuProps['items'] = []
  for (let index = 0; index < users.length; index++) {
    items!.push({
      label: (
        <Space size="small" align="center">
          <UserIcon
            username={users[index].Name}
            userColor={users[index].Color}
            tooltipName={users[index].UserName}
            userInfo={users[index]}
          />
          <h4>{users[index].Name}</h4>
        </Space>
      ),
      key: users[index]._id as string,
    })

    items!.push({
      type: 'divider',
    })
  }

  return items
}
