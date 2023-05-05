import React, { useState } from 'react'
import { FloatButton } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'
import TaskCreation from './TaskCreation'
import { removeCookie } from 'typescript-cookie'
import ObjectID from 'bson-objectid'

const CustomFloatButton: React.FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <FloatButton
        tooltip={<div>Create Task</div>}
        shape="circle"
        type="primary"
        //style={{ right: 94 }}
        icon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          removeCookie('projectId')
          setOpen(true)
        }}
      />
      <TaskCreation
        openModal={open}
        closeFunc={() => setOpen(false)}
        isProjectFixed={false}
        id={ObjectID(new Date().getTime()).toHexString()}
      />
    </>
  )
}

export default CustomFloatButton
