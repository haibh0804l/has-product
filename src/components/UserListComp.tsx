import { Dropdown, Select, Space, Spin, Tag, Tooltip, Input } from 'antd'
import type { MenuProps } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { InputTasks } from '../data/database/InputTasks'
import { Users } from '../data/database/Users'
import { UpdateTask } from '../data/services/tasksService'
import { UPDATE_MODE } from '../util/ConfigText'
import IconGroup from './IconGroup'
import UserIcon from './UserIcon'
import { getCookie } from 'typescript-cookie'
import { log } from 'console'
// import { Label } from 'react-bootstrap'

const { Search } = Input

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
)

interface UserData {
  userData: Users[]
  maxCount: number
  icon: React.ReactNode
  tooltipText?: string
  inputUserData?: Users[]
  onClickMenu?: (e: any) => void
  disabled?: boolean
  mode?: string
  assigneeUpdate?: boolean
  taskId?: string
  userItems?: MenuProps['items']
}

const UserListComp: React.FC<UserData> = ({
  userData,
  maxCount,
  icon,
  tooltipText,
  inputUserData,
  onClickMenu,
  mode,
  assigneeUpdate,
  taskId,
  userItems,
  disabled,
}) => {
  //const [data, setData] = useState<Users[]>(userData)
  const [open, setOpen] = useState(false)
  const [assignee, setAssignee] = useState<Users[]>(
    inputUserData ? inputUserData : [],
  )
  //const items: MenuProps['items'] = []
  const [items, setItems] = useState<MenuProps['items']>([])
  const [finds, setFinds] = useState('')
  useEffect(() => {
    if (items && items.length === 0) {
      let _items: MenuProps['items'] = []
      for (let index = 0; index < userData.length; index++) {
        let fullName =
          userData[index].LastName! + ' ' + userData[index].FirstName!
        _items!.push({
          label: (
            <>
              <Space size="small" align="center">
                <UserIcon
                  username={fullName}
                  userColor={userData[index].Color}
                  tooltipName={userData[index].UserName}
                  userInfo={userData[index]}
                />
                <h4>{fullName}</h4>
              </Space>
            </>
          ),
          key: userData[index]._id as string,
        })
        console.log('-------', userData)

        _items!.push({
          type: 'divider',
        })
      }
      setItems(_items)
    }
  }, [userData])
  useEffect(() => {
    let _items: MenuProps['items'] = []
    _items.push({
      label: (
        <Space direction="vertical">
          <Search
            placeholder="input search text"
            allowClear
            onChange={(e) => {
              setFinds(e.target.value)
            }}
            // onSearch={setFinds}
            style={{ width: 200 }}
          />
        </Space>
      ),
      key: 'search',
    })
    for (let index = 0; index < userData.length; index++) {
      let fullName = userData[index].LastName + ' ' + userData[index].FirstName
      if (fullName.toLocaleLowerCase().includes(finds.toLocaleLowerCase())) {
        _items!.push({
          label: (
            <>
              <Space size="small" align="center">
                <UserIcon
                  username={userData[index].Name}
                  userColor={userData[index].Color}
                  tooltipName={userData[index].UserName}
                  userInfo={userData[index]}
                />
                <h4>{fullName}</h4>
              </Space>
            </>
          ),
          key: userData[index]._id as string,
        })
      }
      // _items!.push({
      //   // type: 'divider',
      // })
    }
    setItems(_items)
  }, [finds])

  const AddAssignee = (id: string) => {
    userData.filter(async (obj) => {
      if (obj._id === id) {
        // assignees.push(obj)
        //setAssignee([...assignee, obj])
        setAssignee([obj])
        //call update service here man
        if (mode === undefined || mode === UPDATE_MODE) {
          //update goes here
          if (assigneeUpdate === true) {
            //update assignee
            const users: Users[] = [obj]
            const inputTasks: InputTasks = {
              Assignee: users,
            }
            await UpdateTask('/api/task/', taskId!, inputTasks)
          } else {
            //update reporter
            const inputTasks: InputTasks = {
              Reporter: obj,
            }
            await UpdateTask('/api/task/', taskId!, inputTasks)
          }
        }

        return assignee
      }
    })
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'search') {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag)
  }

  return (
    <>
      <Space className="ant-group-item-icons" size={0} align="baseline">
        <IconGroup inputList={assignee} maxCount={maxCount} />
        {items && items.length ? (
          !disabled ? (
            <Tooltip title={tooltipText}>
              <Dropdown
                menu={{
                  items: items,
                  onClick: (e) => {
                    if (onClickMenu) onClickMenu(e)
                    AddAssignee(e.key)
                    handleMenuClick(e)
                  },
                }}
                trigger={['click']}
                disabled={disabled}
                onOpenChange={handleOpenChange}
                open={open}
              >
                {/*  <FontAwesomeIcon icon={faUserPlus} /> */}
                {icon}
              </Dropdown>
            </Tooltip>
          ) : null
        ) : (
          <Spin />
        )}
      </Space>
    </>
  )
}

export default UserListComp
