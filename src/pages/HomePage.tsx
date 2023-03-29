import { Layout, theme, Image } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import hptIcon from '../assets/img/hpt-icon.svg'
import { CustomRoutes } from '../customRoutes'
import CustomHeader from '../components/CustomHeader'
import { Users } from '../data/database/Users'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { addManager } from '../redux/features/filter/filterSlice'
import { useAppDispatch } from '../redux/app/hook'

const { Sider } = Layout

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  //const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(addManager([getCookie('user_id')!]))
    //if (sessionStorage.getItem('user_id') === null) {
    if (getCookie('user_id') === undefined || getCookie('user_id') === null) {
      navigate(CustomRoutes.Signin.path, { replace: true })
    } else {
      //navigate(CustomRoutes.MyWork.path, { replace: true })
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
          <Outlet />
          {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer> */}
        </Layout>

        {/* <MainRoutes/> */}
      </Layout>
    </>
  )
}

export default HomePage
