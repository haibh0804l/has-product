import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Tooltip,
  Upload,
} from 'antd'
import type { UploadProps, DatePickerProps, Dropdown, Select } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'

import { Users } from '../data/database/Users'
import { GetUserByType } from '../data/services/allUsersService'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { InsertTask } from '../data/services/tasksService'
import OverDueDate from '../util/OverDueDate'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { useNavigate } from 'react-router-dom'

import {
  ACTIVE,
  ASSIGNEE,
  DEFAULT_STT,
  INSERT_MODE,
  PRIORITY,
  PROJECT,
  REPORTER,
  SELECT,
  STATUS,
} from '../util/ConfigText'
import ObjectID from 'bson-objectid'
import { SubTaskCompProp, SubTaskProp } from '../data/interface/SubTaskProp'
import axios from 'axios'
import { AttachmentResponse } from '../data/database/Attachment'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { CheckExtension } from '../util/Extension'
import { InputTasks } from '../data/database/InputTasks'
import { RemoveAttachment } from '../data/services/attachmentService'
import { SelectorValue } from '../data/interface/SelectorValue'

import {
  CategoriesRequest,
  PriorityCategory,
  StatusCategory,
} from '../data/database/Categories'
import DefaultUsers from '../util/DefaultUsers'
import { RangePickerProps } from 'antd/es/date-picker'
import { colors } from '@novu/notification-center'

import type { MenuProps } from 'antd'
import { AudioOutlined } from '@ant-design/icons'

// const SettingPage: React.FC = () => {
//   const [open, setOpen] = useState(false)

//   const handleMenuClick: MenuProps['onClick'] = (e) => {
//     if (e.key === '3') {
//       setOpen(false)
//     }
//   }

//   const handleOpenChange = (flag: boolean) => {
//     setOpen(flag)
//   }

//   const items: MenuProps['items'] = [
//     {
//       label: 'Clicking me will not close the menu.',
//       key: '1',
//     },
//     {
//       label: 'Clicking me will not close the menu also.',
//       key: '2',
//     },
//     {
//       label: 'Clicking me will close the menu.',
//       key: '3',
//     },
//   ]

//   return (
//     <Dropdown
//       menu={{
//         items,
//         onClick: handleMenuClick,
//       }}
//       onOpenChange={handleOpenChange}
//       open={open}
//     >
//       <a onClick={(e) => e.preventDefault()}>
//         <Space>
//           Hover me
//           <DownOutlined />
//         </Space>
//       </a>
//     </Dropdown>
//   )
// }
// const [assigneeData, setAssigneeData] = useState<Users[]>([])
function SettingPage() {
  const [title, setTile] = useState('')
  useEffect(() => {
    console.log('LOGGGGG')
  })

  return (
    <div>
      <input value={title} onChange={(e) => setTile(e.target.value)} />
      <></>
    </div>
  )
}
export default SettingPage
