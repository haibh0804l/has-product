import React, { useState } from 'react'
import '../assets/css/index.css'
import ScoreRanking from '../components/ScoreRanking'
import PersonalScore from '../components/PersonalScore'
import { Button, Col, Layout, Row, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from 'typescript-cookie'
import { Users } from '../data/database/Users'

const { Content } = Layout

const Dashboard: React.FC = () => {
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)
  const [reload, setReload] = useState(0)

  return (
    <>
      <Content className="inner-content">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ float: 'right', width: '10%' }}>
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
        <Row gutter={10} style={{ marginLeft: '10px', marginRight: '10px' }}>
          {userInfo.Role!.Level <= 3 && (
            <Col span={10}>
              <ScoreRanking
                reloadCount={reload}
                defaultDep={userInfo.Department!}
              />
            </Col>
          )}
          <Col span={10}>
            <PersonalScore
              reloadCount={reload}
              department={userInfo.Department!}
            />
          </Col>
        </Row>
      </Content>
    </>
  )
}

export default Dashboard
