import { useEffect, useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Form, Card, Button, Input, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

//import BgImage from "../../assets/img/illustrations/signin.svg";
import HPTIcon from '../../assets/img/hptIconKnowingIT.png'
import SignInImage from '../../assets/img/signin-side-image.png'
import { CustomRoutes } from '../../customRoutes'
import { GetUserId } from '../../data/services/userIdService'
import { removeCookie, setCookie } from 'typescript-cookie'
import '../../assets/css/layout.css'
import { LOGIN_ERROR, LOGIN_SERVICE_ERROR } from '../../util/ConfigText'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { setUserInfo } from '../../redux/features/userInfo/userInfoSlice'
import { addManager } from '../../redux/features/filter/filterSlice'
import { PageName } from '../../data/interface/PageName'
import {
  addStatusData,
  fetchStatus,
} from '../../redux/features/categories/statusSlice'
import { GetCategories } from '../../data/services/categories'
import {
  CategoriesRequest,
  StatusCategory,
} from '../../data/database/Categories'

type MessageResponse = {
  message: string
  errorMessage: string
}

const Signin: React.FC<PageName> = ({ name }) => {
  localStorage.clear()
  removeCookie('user_id')
  removeCookie('userInfo')
  const [form] = Form.useForm()

  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const username = Form.useWatch('username', form)
  const password = Form.useWatch('password', form)
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = name
  }, [])

  /*   useEffect(() => {
    if (routedChange) {
     
    }
  }, [routedChange]) */

  const routeChange = (serviceUrl: string) => {
    setLoading(true)
    //e.preventDefault()
    //do some fetch here
    //console.log(name)
    const formInput = {
      username: { username }.username,
      password: { password }.password,
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      body: JSON.stringify(formInput),
    }

    fetch(serviceUrl, requestOptions)
      .then((res) => {
        //const responseText: MessageResponse = res.text()
        return res.text()
      })
      .then(async (resText) => {
        const resResponse: MessageResponse = JSON.parse(resText)
        if (resResponse.message !== null && resResponse.message !== '') {
          //alert('Failed to login')
          setErr(resResponse.message)
          setLoading(false)
          //setShowDefault(true)
        } else {
          //console.log('Success', resText)
          setErr('')
          //get userId
          GetUserId(
            process.env.REACT_APP_API_USERS_GETUSERID!,
            //'api.users/getuserid',
            { username }.username,
          ).then(async (r) => {
            if (r) {
              if (r.code !== 200) {
                setLoading(false)
                setErr(r.message + ' ' + r.code)
                //alert('Service failed with code ' + r.code)
              } else {
                setCookie('user_id', r._id as string, { expires: 1 })
                setCookie(
                  'user_name',
                  (r.LastName + ' ' + r.FirstName) as string,
                  { expires: 1 },
                )

                setCookie('userInfo', JSON.stringify(r) as string, {
                  expires: 1,
                })
                localStorage.setItem('user_id', r._id as string)
                dispatch(setUserInfo(r))
                try {
                  const response = await GetCategories({ type: 'Status' })
                  const responsePri = await GetCategories({ type: 'Priority' })
                  localStorage.setItem(
                    'statusData',
                    JSON.stringify(response.data as StatusCategory[]),
                  )
                  localStorage.setItem(
                    'priorityData',
                    JSON.stringify(responsePri.data as StatusCategory[]),
                  )
                  if (localStorage.getItem('location')) {
                    if (
                      JSON.parse(localStorage.getItem('location')!).pathname !==
                      '/'
                    ) {
                      navigate(
                        JSON.parse(localStorage.getItem('location')!).pathname,
                      )
                    } else {
                      navigate(CustomRoutes.MyWork.path)
                    }
                    localStorage.removeItem('location')
                  } else {
                    navigate(CustomRoutes.MyWork.path)
                  }
                } catch {
                  localStorage.setItem('statusData', JSON.stringify([]))
                  localStorage.setItem('priorityData', JSON.stringify([]))
                }
                /* if (localStorage.getItem('location')) {
                  if (
                    JSON.parse(localStorage.getItem('location')!).pathname !==
                    '/'
                  ) {
                    navigate(
                      JSON.parse(localStorage.getItem('location')!).pathname,
                    )
                  } else {
                    navigate(CustomRoutes.MyWork.path)
                  }
                  localStorage.removeItem('location')
                } else {
                  navigate(CustomRoutes.MyWork.path)
                } */
              }
            } else {
              setLoading(false)
              setErr(LOGIN_SERVICE_ERROR)
            }
          })
        }
      })
      .catch((error) => {
        setLoading(false)
        setErr(LOGIN_SERVICE_ERROR)
      })
  }

  return (
    <>
      <main>
        <center>
          <div
            className="bg-image"
            style={{
              backgroundImage: `url(${SignInImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundColor: 'rgba(228, 240, 244, 1)',
              height: '100vh',
              width: '100vw',
            }}
          >
            <Card
              style={{
                width: '30%',
                float: 'right',
                height: '90%',
                marginRight: '1%',
                marginTop: '5vh',
              }}
            >
              <div>
                <div
                  className="w-100 position-relative"
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <img
                      style={{
                        marginTop: '5vh',
                        marginBottom: '5vh',
                      }}
                      src={HPTIcon}
                      alt="HPTIcon"
                    />
                    <h3
                      style={{
                        marginBottom: '5vh',
                      }}
                      className="mb-0 mt-5"
                    >
                      Đăng nhập
                    </h3>
                  </div>
                  <Form form={form} layout="vertical">
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your username!',
                        },
                        { type: 'string', min: 6 },
                      ]}
                    >
                      <Input placeholder="Nhap username" />
                    </Form.Item>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                        { type: 'string' },
                      ]}
                    >
                      <Input.Password
                        placeholder="Nhap password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onPressEnter={() =>
                          //routeChange('api/users/authen')
                          {
                            routeChange(
                              process.env.REACT_APP_API_USERS_AUTHEN
                                ? process.env.REACT_APP_API_USERS_AUTHEN
                                : '',
                            )
                          }
                        }
                      />
                    </Form.Item>
                    {loading === false ? (
                      <Button
                        type="primary"
                        block
                        onClick={() =>
                          routeChange(process.env.REACT_APP_API_USERS_AUTHEN!)
                        }
                      >
                        Đăng nhập
                      </Button>
                    ) : (
                      <Spin size="large" />
                    )}
                    <br />
                    <br />
                    {err !== '' && <div className="overdue">{err}</div>}
                  </Form>
                </div>
              </div>
            </Card>
          </div>
        </center>
      </main>
    </>
  )
}
export default Signin
