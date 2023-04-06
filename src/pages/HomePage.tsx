import { Layout, theme, Image, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import hptIcon from '../assets/img/hpt-icon.svg'
import { CustomRoutes } from '../customRoutes'
import CustomHeader from '../components/CustomHeader'
import { Users } from '../data/database/Users'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import {
  addAssignee,
  addManager,
  addReporter,
} from '../redux/features/filter/filterSlice'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'

const { Sider } = Layout

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  //const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  const [isReload, setIsReload] = useState(true)
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (filterInit.tabs === '1') {
      dispatch(addAssignee([getCookie('user_id')!]))
    } else if (filterInit.tabs === '2') {
      dispatch(addReporter([getCookie('user_id')!]))
    } else {
      dispatch(addManager([getCookie('user_id')!]))
    }
    //dispatch(addManager([getCookie('user_id')!]))
    //if (sessionStorage.getItem('user_id') === null) {
    /* if (getCookie('user_id') === undefined || getCookie('user_id') === null) {
      navigate(CustomRoutes.Signin.path, { replace: true })
    } else {
      //navigate(CustomRoutes.MyWork.path, { replace: true })
    } */

    const reloadCount = sessionStorage.getItem('reloadCount')
    if (reloadCount) {
      //console.log('Ok')
      if (Number(reloadCount) < 2) {
        sessionStorage.setItem('reloadCount', String(Number(reloadCount) + 1))
        window.location.reload()
      } else {
        setIsReload(false)
        //sessionStorage.removeItem('reloadCount')
      }
    } else {
      navigate(0)
      setIsReload(false)
      sessionStorage.setItem('reloadCount', String(Number(reloadCount) + 1))
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
