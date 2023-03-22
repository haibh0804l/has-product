import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import FindIcon from '../data/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'

interface Type {
  type: string
  text: string
}

const PriorityDropdown: React.FC<Type> = ({ type, text }) => {
  const [changeText, setChangeText] = useState(text)

  let items: MenuProps['items'] = [
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#F43F5E" />
            <h4>Urgent</h4>
          </Space>
        </>
      ),
      key: 'Urgent',
      onClick: (e) => setChangeText(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#FACC15" />
            <h4>High</h4>
          </Space>
        </>
      ),
      key: 'High',
      onClick: (e) => setChangeText(e.key),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#2DD4BF" />
            <h4>Medium</h4>
          </Space>
        </>
      ),
      key: 'Medium',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <>
          <Space size="small" align="center">
            <FontAwesomeIcon icon={faFlag} color="#4B5563" />
            <h4>Low</h4>
          </Space>
        </>
      ),
      key: 'Low',
    },
  ]
  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      onOpenChange={(e) => console.log(e)}
    >
      <a
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        <Space>
          <FindIcon type={type} text={changeText} />
        </Space>
      </a>
    </Dropdown>
  )
}

export default PriorityDropdown
