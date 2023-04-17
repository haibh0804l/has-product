import React from 'react'
import type { MenuProps } from 'antd'
import { Menu, theme } from 'antd'
import {
  faArchive,
  faChartSimple,
  faCogs,
  faDollarSign,
  faHome,
  faProjectDiagram,
  faTasks,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { CustomRoutes } from '../customRoutes'
import '../assets/css/index.css'

const { useToken } = theme

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: React.ReactNode,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem(
    'Dashboard',
    'Dashboard',
    <Link to={CustomRoutes.Dashboard.path}>
      <FontAwesomeIcon icon={faChartSimple} />
    </Link>,
  ),

  getItem(
    'My Work',
    'My Work',
    <Link to={CustomRoutes.MyWork.path}>
      <FontAwesomeIcon icon={faArchive} />
    </Link>,
  ),
  // getItem('Work', 'Work', <FontAwesomeIcon icon={faTasks} />, [
  //   getItem(
  //     'Công việc của tôi',
  //     CustomRoutes.MyWork.name,
  //     <Link to={CustomRoutes.MyWork.path}>
  //       <FontAwesomeIcon icon={faArchive} />
  //     </Link>,
  //   ),
  /*  getItem(
      'My Space',
      'My Space',
      <Link to={CustomRoutes.About.path}>
        <FontAwesomeIcon icon={faProjectDiagram} />
      </Link>,
      [
        getItem(
          'HAS BA',
          'HAS BA',
          <FontAwesomeIcon icon={faProjectDiagram} />,
          [
            getItem(
              'Công việc chung',
              'Công việc chung',
              <FontAwesomeIcon icon={faProjectDiagram} />,
            ),
            getItem(
              'RPA Scheduler',
              'RPA Scheduler',
              <FontAwesomeIcon icon={faProjectDiagram} />,
            ),
          ],
        ),
        getItem(
          'HAS Sales',
          'HAS Sales',
          <FontAwesomeIcon icon={faProjectDiagram} />,
        ),
      ],
    ), */
  // ]),
  /* getItem('User', 'User', <FontAwesomeIcon icon={faUser} />),
  getItem('Team', 'Team', <FontAwesomeIcon icon={faDollarSign} />, [
    getItem('Team 1', 'Team 1'),
    getItem('Team 2', 'Team 2'),
  ]),
  getItem('Files', 'Files', <FontAwesomeIcon icon={faCogs} />), */
]

const SideMenu: React.FC = () => {
  const { token } = useToken()
  return (
    <>
      <Menu
        theme="dark"
        style={{ backgroundColor: token.colorPrimary }}
        defaultSelectedKeys={['1']}
        mode="vertical"
        items={items}
      ></Menu>
    </>
  )
}

export default SideMenu
