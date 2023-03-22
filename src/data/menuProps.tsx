import { faFlag, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/css/index.css'
import type { MenuProps } from 'antd'
import { Space } from 'antd'
import { statusData } from './statusData'

const priority: MenuProps['items'] = [
  {
    label: (
      <>
        <Space size="small" align="center">
          <FontAwesomeIcon icon={faFlag} color="#F43F5E" />
          <h4>Urgent</h4>
        </Space>
      </>
    ),
    key: '1',
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
    key: '2',
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
    key: '3',
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
    key: '4',
  },
]

const status: MenuProps['items'] = [
  {
    label: (
      <>
        <Space>
          <FontAwesomeIcon icon={faSquare} color={statusData[0].color} />
          <h4>{statusData[0].name}</h4>
        </Space>
      </>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <>
        <Space>
          <FontAwesomeIcon icon={faSquare} color={statusData[1].color} />
          <h4>{statusData[1].name}</h4>
        </Space>
      </>
    ),
    key: '2',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <>
        <Space>
          <FontAwesomeIcon icon={faSquare} color={statusData[2].color} />
          <h4>{statusData[2].name}</h4>
        </Space>
      </>
    ),
    key: '3',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <>
        <Space>
          <FontAwesomeIcon icon={faSquare} color={statusData[3].color} />
          <h4>{statusData[3].name}</h4>
        </Space>
      </>
    ),
    key: '4',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <>
        <Space>
          <FontAwesomeIcon icon={faSquare} color={statusData[4].color} />
          <h4>{statusData[4].name}</h4>
        </Space>
      </>
    ),
    key: '5',
  },
]

export { priority, status }
