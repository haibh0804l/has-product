import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Space, TabPaneProps, Tabs } from 'antd'
import TaskList from './table/TaskList'
import { Task } from '../data/interface/task'
import TaskListOverDue from './table/TaskListOverdue'
import { Tasks } from '../data/database/Tasks'
import Search from 'antd/es/input/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToLowerCaseNonAccentVietnamese } from '../util/FormatText'
import _ from 'lodash'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { SearchBar } from './filter/SearchBar'
import Project from './Project'
import { Role } from '../data/database/Role'
import { getCookie } from 'typescript-cookie'
import { fetchPersonalScore } from '../redux/features/report/personalScoreSlice'
import { PersonalScoreRequest } from '../data/database/Report'
import { Users } from '../data/database/Users'

interface TaskInput {
  assigneeTask: Tasks[]
  otherTask: Tasks[]
  assigneeTaskNum: number
  otherTaskNum: number
}

const App: React.FC<TaskInput> = ({
  assigneeTask,
  otherTask,
  assigneeTaskNum,
  otherTaskNum,
}) => {
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)
  const role: Role = JSON.parse(getCookie('userInfo') as string).Role
  const [myScore, setMyScore] = useState('')

  //let scoreMonth = ''
  const [items, setItems] = useState<any[]>([])
  const [collapseShowMore, setCollapseShowMore] = useState(true)
  const numOfAssigneeTasks = useAppSelector(
    (state) => state.myTaskList.numOfTask,
  )
  const numOfReporterTasks = useAppSelector(
    (state) => state.reportToMeTaskList.numOfTask,
  )
  const personalScoreReq: PersonalScoreRequest = {
    userId: getCookie('user_id')!,
    department: userInfo.Department,
    baseOnMonth: 1,
  }

  const _myScore = useAppSelector((state) => state.personalScore)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPersonalScore(personalScoreReq))
  }, [])

  useEffect(() => {
    if (!_myScore.loading && _myScore.score.length !== undefined) {
      if (_myScore.score.length === 0) {
        setMyScore('N/A')
      } else {
        setMyScore(
          _myScore.score[0].TotalScore
            ? _myScore.score[0].TotalScore.toString()
            : 'N/A',
        )
      }
    }
  }, [_myScore.loading, _myScore.score.length])
  const scoreMonthHandle = 'My score this month : ' + myScore
  const [scoreMonth, setScoreMonth] = useState(scoreMonthHandle)
  const OnChange = (key: string) => {
    sessionStorage.setItem('tab', key)
    if (key === '1') {
      setScoreMonth('My score this month : ' + myScore)
      //scoreMonth = scoreMonthHandle
    } else {
      setScoreMonth('')
      //scoreMonth = ''
    }
  }

  return (
    <>
      {role.Level >= 3 && myScore ? (
        <>
          <Tabs
            tabBarExtraContent={scoreMonth}
            defaultActiveKey={
              sessionStorage.getItem('tab')?.toString()
                ? sessionStorage.getItem('tab')?.toString()
                : '1'
            }
            onChange={OnChange}
            items={[
              {
                label: (
                  <Space align="center">
                    My task
                    <p
                      style={{
                        padding: '0px 4px 0px 4px',
                        border: '1px solid',
                        borderRadius: '10px',
                        fontSize: '11px',
                      }}
                    >
                      {numOfAssigneeTasks}
                    </p>
                  </Space>
                ),
                key: '1',
                children: (
                  <TaskList
                    //inputData={srcAssigneeTask}
                    showMore={true}
                    increment={3}
                    collapseShowMore={collapseShowMore}
                  />
                ),
              },
              {
                label: (
                  <Space align="center">
                    Report to me
                    <p
                      style={{
                        padding: '0px 4px 0px 4px',
                        border: '1px solid',
                        borderRadius: '10px',
                        fontSize: '11px',
                      }}
                    >
                      {numOfReporterTasks}
                    </p>
                  </Space>
                ),
                key: '2',
                children: (
                  <TaskListOverDue
                    //inputData={srcOtherTask}
                    showMore={false}
                    increment={3}
                  />
                ),
              },
              {
                label: <Space align="center">My team</Space>,
                key: '3',
                children: (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Project />
                  </Space>
                ),
              },
            ]}
          />
        </>
      ) : (
        <Tabs
          tabBarExtraContent={scoreMonth}
          defaultActiveKey={
            sessionStorage.getItem('tab')?.toString()
              ? sessionStorage.getItem('tab')?.toString()
              : '1'
          }
          onChange={OnChange}
          items={[
            {
              label: (
                <Space align="center">
                  {/* var str = new String("My task");  */}
                  My task
                  <p
                    style={{
                      padding: '0px 4px 0px 4px',
                      border: '1px solid',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  >
                    {numOfAssigneeTasks}
                  </p>
                </Space>
              ),
              key: '1',
              children: (
                <TaskList
                  //inputData={srcAssigneeTask}
                  showMore={true}
                  increment={3}
                  collapseShowMore={collapseShowMore}
                />
              ),
            },
            {
              label: (
                <Space align="center">
                  Report to me
                  <p
                    style={{
                      padding: '0px 4px 0px 4px',
                      border: '1px solid',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  >
                    {numOfReporterTasks}
                  </p>
                </Space>
              ),
              key: '2',
              children: (
                <TaskListOverDue
                  //inputData={srcOtherTask}
                  showMore={false}
                  increment={3}
                />
              ),
            },
          ]}
        />
      )}
    </>
  )
}

export default App
