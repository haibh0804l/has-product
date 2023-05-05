import { Layout, theme, Image, Spin } from 'antd'
import { useEffect, useState } from 'react'
import {
  Navigate,
  Outlet,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import hptIcon from '../assets/img/hpt-icon.svg'
import { CustomRoutes } from '../customRoutes'
import CustomHeader from '../components/CustomHeader'
import { Users } from '../data/database/Users'
import { getCookie } from 'typescript-cookie'
import {
  addAssignee,
  addManager,
  addReporter,
} from '../redux/features/filter/filterSlice'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { PageName } from '../data/interface/PageName'
import { fetchStatus } from '../redux/features/categories/statusSlice'
import { fetchPriority } from '../redux/features/categories/prioritySlice'

const { Sider } = Layout

const HomePage: React.FC<PageName> = ({ name }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  const [isReload, setIsReload] = useState(true)
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = name
    localStorage.setItem('location', JSON.stringify(location))
    if (filterInit.tabs === '1') {
      dispatch(addAssignee([getCookie('user_id')!]))
    } else if (filterInit.tabs === '2') {
      dispatch(addReporter([getCookie('user_id')!]))
    } else {
      dispatch(addManager([getCookie('user_id')!]))
    }

    const reloadCount = localStorage.getItem('reloadCount')
    if (reloadCount) {
      if (Number(reloadCount) < 2) {
        localStorage.setItem('reloadCount', String(Number(reloadCount) + 1))
        window.location.reload()
      } else {
        setIsReload(false)
        //localStorage.removeItem('reloadCount')
      }
    } else {
      navigate(0)
      setIsReload(false)
      localStorage.setItem('reloadCount', String(Number(reloadCount) + 1))
    }
  }, [])

  const userData =
    getCookie('userInfo') !== undefined
      ? (JSON.parse(getCookie('userInfo') as string) as Users)
      : {}

  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <>
      {getCookie('user_id') ? (
        <Layout style={{ height: '100vh' }}>
          {/* Side Menu */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="custom-sider"
          >
            <div style={{ height: 32, margin: 16 }}>
              <Image src={hptIcon} preview={false} />
            </div>
            <SideMenu />
          </Sider>
          {/* Inner Container */}
          <Layout
            className="site-layout"
            style={{ height: '100vh', overflowY: 'hidden' }}
          >
            <CustomHeader
              pageName={CustomRoutes.MyWork.name}
              // pageName={CustomRoutes.MyWork.name = "My work" ?('My work') :('Dashboard') }
              userData={userData}
            />
            {!isReload ? <Outlet /> : <Spin size="large" />}
            {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer> */}
          </Layout>

          {/* <MainRoutes/> */}
        </Layout>
      ) : (
        <Navigate to={CustomRoutes.Signin.path} replace />
      )}
    </>
  )
}

export default HomePage
