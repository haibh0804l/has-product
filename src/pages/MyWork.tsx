import React, { useEffect } from 'react'
import { Layout } from 'antd'
import CustomTab from '../components/CustomTab'
import '../assets/css/index.css'

import CustomFloatButton from '../components/QuickCreate'
import { PageName } from '../data/interface/PageName'
import { useAppSelector } from '../redux/app/hook'

const { Content } = Layout

const MyWork: React.FC<PageName> = ({ name }) => {
  useEffect(() => {
    document.title = name
  }, [])

  return (
    <>
      <>
        <CustomFloatButton />
        <Content className="inner-content">
          <div
            style={{
              padding: '0px 24px 0px 24px',
              minHeight: 360,
            }}
          >
            <CustomTab />
          </div>
        </Content>
      </>
    </>
  )
}

export default MyWork
