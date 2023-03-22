import React, { useEffect, useState } from 'react'
import { Avatar, Col, Divider, List, Row, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import '../assets/css/index.css'
import CustomHeader from './CustomHeader'
import { Content } from 'antd/es/layout/layout'
import { CustomRoutes } from '../customRoutes'
import TaskList from './table/TaskList'
import { Task } from '../data/interface/task'

interface DataType {
  gender: string
  name: {
    title: string
    first: string
    last: string
  }
  email: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
  nat: string
}

const Lists: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Task[]>([])

  const loadMoreData = () => {
    if (loading) {
      return
    }
    setLoading(true)
  }

  useEffect(() => {
    loadMoreData()
  }, [])

  return (
    <>
      <CustomHeader pageName={CustomRoutes.MyWork.name} />
      <Content className="inner-content">
        <div
          style={{
            padding: 24,
            minHeight: 360,
            //background: colorBgContainer,
          }}
        >
          <h3>{CustomRoutes.MyWork.name}</h3>

          <div
            id="scrollableDiv"
            style={{
              height: 400,
              overflow: 'auto',
              padding: '0',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={data.length < 50}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item key="1">
                    {/* <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              /> */}
                    {/* <TaskList inputData={data} showMore={false} increment={3}/> */}
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </div>
      </Content>
    </>
  )
}

export default Lists
