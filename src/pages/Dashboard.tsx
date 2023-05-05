import React, { useEffect, useState } from 'react'
import '../assets/css/index.css'
import ScoreRanking from '../components/dashboard/ScoreRanking'
import PersonalScore from '../components/dashboard/PersonalScore'
import { Button, Col, Layout, Row, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from 'typescript-cookie'
import { Users } from '../data/database/Users'
import TrustRanking from '../components/dashboard/TrustRanking'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchTasksReporter } from '../redux/features/tasks/reporterTaskSlice'
import { Params } from '../data/interface/task'
import { CustomRoutes } from '../customRoutes'
import { PageName } from '../data/interface/PageName'

const { Content } = Layout

const Dashboard: React.FC<PageName> = ({ name }) => {
  const [showTrustScore, setShowTrustScore] = useState(false)
  const task = useAppSelector((state) => state.reporterTasks)
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)
  const params: Params = {
    serviceUrl: '',
    type: getCookie('user_id')?.toString()!,
    //userId: getCookie('user_id')?.toString(),
  }
  const dispatch = useAppDispatch()
  const [reload, setReload] = useState(0)

  useEffect(() => {
    dispatch(fetchTasksReporter(params))
  }, [reload])

  useEffect(() => {
    if (!task.loading && task.tasks.length) {
      if (task.tasks.length === 0) {
        setShowTrustScore(false)
      } else {
        for (let index = 0; index < task.tasks.length; index++) {
          const element = task.tasks[index]
          if (element.Assignee[0]._id !== getCookie('user_id')) {
            setShowTrustScore(true)
            break
          }
        }
      }
    }
  }, [task.loading, task.tasks.length])

  useEffect(() => {
    document.title = name
  }, [])
  return (
    <>
      <Content className="inner-content">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ float: 'right', width: '7%' }}>
            <Button type="primary">
              <Space direction="horizontal">
                <FontAwesomeIcon icon={faRefresh} />
                <div
                  style={{ marginRight: '1px' }}
                  onClick={() => setReload(reload + 1)}
                >
                  Refresh
                </div>
              </Space>
            </Button>
          </div>
        </Space>
        <div
          style={{
            height: '88vh',
            overflowY: 'scroll',
            marginBottom: '100px',
          }}
        >
          <Row gutter={10} style={{ marginLeft: '10px', marginRight: '10px' }}>
            {userInfo.Role!.Level >= 3 && (
              <Col span={12}>
                <ScoreRanking
                  reloadCount={reload}
                  defaultDep={userInfo.Group![0].Name!}
                />
              </Col>
            )}
            <Col span={12}>
              <PersonalScore
                reloadCount={reload}
                department={userInfo.Group![0].Name!}
              />
            </Col>
          </Row>
          <Row
            gutter={10}
            style={{
              marginLeft: '10px',
              marginRight: '10px',
              marginTop: '10px',
            }}
          >
            {showTrustScore && (
              <Col span={12}>
                <TrustRanking reloadCount={reload} />
              </Col>
            )}
          </Row>
        </div>
      </Content>
    </>
  )
}

export default Dashboard
