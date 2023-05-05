import React, { useState } from 'react'
import { Button, Layout } from 'antd'
import Breadcrumbs from './Breadcrumbs'
import type { MenuProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Space, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import UserIcon from './UserIcon'
import { Users } from '../data/database/Users'
import { CustomRoutes } from '../customRoutes'
import { getCookie, removeCookie } from 'typescript-cookie'
import InAppNotification from './InAppNotification'

const { Header, Content, Footer, Sider } = Layout

interface IHeader {
  pageName: string
  userData?: Users
}

const CustomHeader: React.FC<IHeader> = ({ pageName, userData }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const userInfo = JSON.parse(getCookie('userInfo')!) as Users
  const navigate = useNavigate()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setOpenMenu(false)
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Space
          direction="vertical"
          size={7}
          style={{ display: 'flex', margin: ' 7px 30px -7px 30px' }}
          align="center"
        >
          <UserIcon userInfo={userData} userColor={userData?.Color} size="" />
          <Space
            direction="vertical"
            size={2}
            align="center"
            style={{ display: 'flex', margin: ' 7px' }}
          >
            <p>{userData?.Name}</p>
            <h4>{userData?.LastName + ' ' + userData?.FirstName}</h4>
            <p>{userData?.Role?.Name}</p>
          </Space>
        </Space>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      label: (
        <center
          style={{ width: '100%' }}
          onClick={() => {
            localStorage.clear()
            removeCookie('user_id')
            removeCookie('userInfo')
            localStorage.removeItem('reloadCount')
            navigate(CustomRoutes.Signin.path)
          }}
        >
          <Link to={CustomRoutes.Signin.path}>Log out</Link>
        </center>
      ),
    },
  ]

  return (
    <Header style={{ padding: 0, background: 'white', height: '8vh' }}>
      <Row>
        <Col span={12}>
          <Breadcrumbs main="Home" sub={pageName} />
        </Col>
        <Col span={12}>
          <div
            className="space-align-block"
            style={{ float: 'right', margin: '0 30px' }}
          >
            <Space align="center">
              {/* <FontAwesomeIcon icon={faBell} /> */}
              <InAppNotification />
              <Dropdown
                menu={{ items, onClick: handleMenuClick }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
                trigger={['click']}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <UserIcon userInfo={userInfo} userColor={userInfo.Color} />
                  </Space>
                </a>
              </Dropdown>
            </Space>
          </div>
        </Col>
      </Row>
    </Header>
  )
}

export default CustomHeader
