import React, { useCallback, useEffect, useState } from 'react'
import { Layout } from 'antd'
import CustomTab from '../components/CustomTab'
import '../assets/css/index.css'

import { Tasks } from '../data/database/Tasks'
import CustomFloatButton from '../components/QuickCreate'
import { getCookie } from 'typescript-cookie'

const { Content } = Layout

const MyWork: React.FC = () => {
  const _id = getCookie('user_id') as string
  const [todayData, setTodayData] = useState<Tasks[]>([])
  const [otherData, setOtherData] = useState<Tasks[]>([])

  return (
    <>
      <CustomFloatButton />
      <Content className="inner-content">
        <div
          style={{
            padding: '0px 24px 0px 24px',
            minHeight: 360,
          }}
        >
          <CustomTab
            assigneeTask={todayData}
            assigneeTaskNum={todayData.length}
            otherTask={otherData}
            otherTaskNum={otherData.length}
          />
        </div>
      </Content>
    </>
  )
}

export default MyWork
