import React, { useCallback, useEffect, useState } from 'react'
import {
  Table,
  Layout,
  Button,
  Checkbox,
  MenuProps,
  Spin,
  Input,
  Row,
  Col,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import ParagraphExample from '../ParagraphExample'
import { Tasks } from '../../data/database/Tasks'
import DateFormatter from '../../util/DateFormatter'
import IconGroup from '../IconGroup'
import TaskDetails from '../../pages/TaskDetails'
import { CustomRoutes } from '../../customRoutes'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'
import { Role } from '../../data/database/Role'
import { Status } from '../../data/interface/Status'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { Params } from '../../data/interface/task'
import { fetchTasksReporter } from '../../redux/features/tasks/reporterTaskSlice'
import { reportToMeTaskChange } from '../../redux/features/reportToMeTask/reportToMeTaskSlice'
import { IGNORE_STT_DEFAULT, SEARCH, UPDATE_MODE } from '../../util/ConfigText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'
import GetStatusIgnoreList from '../../util/StatusList'
import { status } from '../../data/menuProps'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  project: React.ReactNode
  path?: string
  assignee: React.ReactNode
  priority: React.ReactNode
  startDate?: React.ReactNode
  dueDate: React.ReactNode
  score?: React.ReactNode
}

interface InputData {
  //inputData: Tasks[]
  showMore: boolean
  increment: number
}

let countIndex = 0
let inputLength = 0
//let inputObj: Tasks[] = []
//let isLoaded = false

const TaskListOverDue: React.FC<InputData> = ({
  //inputData,
  showMore,
  increment,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const refresh = location.state
  const [input, setInput] = useState<Tasks[]>([])
  const [searchValue, setSearchValue] = useState(
    sessionStorage.getItem('searchValueTaskReport')
      ? sessionStorage.getItem('searchValueTaskReport')
      : '',
  )
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const [isShowMore, setShowMore] = useState(true)
  const [showCompleted, setShowCompleted] = useState(
    sessionStorage.getItem('showClosedTaskReport') === 'true',
  )
  const [loading, setLoading] = useState(false)
  const task = useAppSelector((state) => state.reporterTasks)
  const dispatch = useAppDispatch()
  const params: Params = {
    serviceUrl: '',
    type: getCookie('user_id')?.toString()!,
    //userId: getCookie('user_id')?.toString(),
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: '5vw',
    },
    {
      title: 'Task',
      dataIndex: 'task',
      width: '30vw',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      width: '20vw',
    },
    /*  {
    title: 'Path',
    dataIndex: 'path',
    width: '14vw',
  }, */
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      width: '12vw',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
      width: '10vw',
    },
    /* {
    title: 'Start date',
    dataIndex: 'startDate',
    width: '10vw',
  }, */
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      width: '10vw',
    },
    {
      ...(showCompleted === true
        ? {
            title: 'Score',
            dataIndex: 'score',
            width: '10vw',
          }
        : {
            width: '0vw',
          }),
    },
  ]

  const ReorderTask = (inputTaskList: Tasks[]) => {
    let inputObj: Tasks[] = JSON.parse(JSON.stringify(inputTaskList))
    inputLength = inputObj.length

    inputObj.forEach((element) => {
      if (element.Priority === 'Urgent') {
        element.PriorityNum = 1
      } else if (element.Priority === 'High') {
        element.PriorityNum = 2
      } else if (element.Priority === 'Medium') {
        element.PriorityNum = 3
      } else if (element.Priority === 'Low') {
        element.PriorityNum = 4
      } else {
        element.PriorityNum = 5
      }
    })
    inputObj = inputObj.sort(
      (a, b) =>
        new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime() ||
        (a.PriorityNum as number) - (b.PriorityNum as number) ||
        new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime(),
    )

    setInput(inputObj)
    const lin = 0
    const _data: DataType[] = []
    if (inputLength > 0) {
      for (let index = 0; index < inputLength; index++) {
        const _ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          inputObj[index].Assignee[0]._id!,
          inputObj[index].Reporter._id!,
          inputObj[index].Status,
        )
        _data.push({
          key: inputObj[index]._id ? index.toString() : index.toString(),
          status: (
            <DropdownProps
              type="Status"
              text={inputObj[index].Status}
              button={false}
              taskId={inputObj[index]._id}
              ignoreStt={_ignoreList}
              task={inputObj[index]}
              onClickMenu={handleMenuClickStatus}
            />
          ),

          task: (
            <div onClick={() => OnNavigate(inputObj[index])}>
              <ParagraphExample
                name={inputObj[index].TaskName}
                task={inputObj[index]}
              />
            </div>
          ),
          project: (
            <>
              <div>
                <ParagraphExample
                  name={
                    inputObj[index].Project
                      ? inputObj[index].Project?.ProjectName
                      : '-'
                  }
                  task={inputObj[index]}
                />
              </div>
            </>
          ),
          assignee: <IconGroup inputList={inputObj[index].Assignee} />,
          priority: (
            <DropdownProps
              type="Priority"
              text={
                inputObj[index].Priority
                  ? inputObj[index].Priority
                  : 'undefined'
              }
              button={false}
              taskId={inputObj[index]._id}
              ignoreStt={_ignoreList}
              mode={UPDATE_MODE}
            />
          ),
          dueDate: (
            <>
              {inputObj[index].DueDate === null ? (
                ''
              ) : inputObj[index].Status === 'Incompleted' ||
                inputObj[index].Status === 'Completed' ? (
                inputObj[index].CloseDate! === undefined ? (
                  <div>
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                ) : new Date(inputObj[index].DueDate!) >=
                  new Date(inputObj[index].CloseDate!) ? (
                  <div>
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                ) : (
                  <div className="overdue">
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                )
              ) : new Date() > new Date(inputObj[index].DueDate!) ? (
                <div className="overdue">
                  <DateFormatter
                    dateString={inputObj[index].DueDate!}
                    task={inputObj[index]}
                  />
                </div>
              ) : (
                <div>
                  <DateFormatter
                    dateString={inputObj[index].DueDate!}
                    task={inputObj[index]}
                  />
                </div>
              )}
            </>
          ),
          score: <p>{inputObj[index].Score ? inputObj[index].Score : '_'}</p>,
        })
        countIndex++
      }
      setDataInput(_data)
    } else {
      if (!task.loading && task.tasks.length) {
        setDataInput([])
        setInput([])
      }
    }
  }

  const ReorderClosedTask = (inputTaskList: Tasks[]) => {
    let inputObj: Tasks[] = JSON.parse(JSON.stringify(inputTaskList))
    inputLength = inputObj.length

    inputObj.forEach((element) => {
      if (element.Priority === 'Urgent') {
        element.PriorityNum = 1
      } else if (element.Priority === 'High') {
        element.PriorityNum = 2
      } else if (element.Priority === 'Medium') {
        element.PriorityNum = 3
      } else if (element.Priority === 'Low') {
        element.PriorityNum = 4
      } else {
        element.PriorityNum = 5
      }
    })
    inputObj = inputObj.sort(
      (a, b) =>
        (a.PriorityNum as number) - (b.PriorityNum as number) ||
        new Date(b.DoneDate ? b.DoneDate : new Date()).getTime() -
          new Date(a.CloseDate ? a.CloseDate : new Date()).getTime(),
    )

    setInput(inputObj)

    const _data: DataType[] = []
    if (inputLength > 0) {
      for (let index = 0; index < inputLength; index++) {
        const _ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          inputObj[index].Assignee[0]._id!,
          inputObj[index].Reporter._id!,
          inputObj[index].Status,
        )
        _data.push({
          key: inputObj[index]._id ? index.toString() : index.toString(),
          status: (
            <DropdownProps
              type="Status"
              text={inputObj[index].Status}
              button={false}
              taskId={inputObj[index]._id}
              ignoreStt={_ignoreList}
              task={inputObj[index]}
              onClickMenu={handleMenuClickStatus}
              mode={UPDATE_MODE}
            />
          ),
          task: (
            <div onClick={() => OnNavigate(inputObj[index])}>
              <ParagraphExample
                name={inputObj[index].TaskName}
                task={inputObj[index]}
              />
            </div>
          ),
          project: (
            <>
              <div>
                <ParagraphExample
                  name={
                    inputObj[index].Project
                      ? inputObj[index].Project?.ProjectName
                      : '-'
                  }
                  task={inputObj[index]}
                />
              </div>
            </>
          ),
          assignee: <IconGroup inputList={inputObj[index].Assignee} />,
          priority: (
            <DropdownProps
              type="Priority"
              text={
                inputObj[index].Priority
                  ? inputObj[index].Priority
                  : 'undefined'
              }
              button={false}
              taskId={inputObj[index]._id}
              ignoreStt={_ignoreList}
              mode={UPDATE_MODE}
            />
          ),
          dueDate: (
            <>
              {inputObj[index].DueDate === null ? (
                ''
              ) : inputObj[index].Status === 'Incompleted' ||
                inputObj[index].Status === 'Completed' ? (
                inputObj[index].CloseDate! === undefined ? (
                  <div>
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                ) : new Date(inputObj[index].DueDate!) >=
                  new Date(inputObj[index].CloseDate!) ? (
                  <div>
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                ) : (
                  <div className="overdue">
                    <DateFormatter
                      dateString={inputObj[index].DueDate!}
                      task={inputObj[index]}
                    />
                  </div>
                )
              ) : new Date() > new Date(inputObj[index].DueDate!) ? (
                <div className="overdue">
                  <DateFormatter
                    dateString={inputObj[index].DueDate!}
                    task={inputObj[index]}
                  />
                </div>
              ) : (
                <div>
                  <DateFormatter
                    dateString={inputObj[index].DueDate!}
                    task={inputObj[index]}
                  />
                </div>
              )}
            </>
          ),
          score: <p>{inputObj[index].Score ? inputObj[index].Score : '_'}</p>,
        })
        countIndex++
      }
      setDataInput(_data)
    } else {
      if (!task.loading && task.tasks.length) {
        setDataInput([])
        setInput([])
      }
    }
  }

  const Sorting = () => {
    let value = searchValue!
    if (value !== '') {
      if (showCompleted === false) {
        const sortedTask: Tasks[] = JSON.parse(JSON.stringify(task.tasks))
        const inputObjFilter = sortedTask.filter(
          (dataOtherEle) =>
            dataOtherEle.Status.toLowerCase() !== 'Completed'.toLowerCase() &&
            //dataOtherEle.Status.toLowerCase() !== 'Done'.toLowerCase() &&
            dataOtherEle.Status.toLowerCase() !== 'Incompleted'.toLowerCase(),
        )
        const sortResult: Tasks[] = inputObjFilter.filter((x) =>
          ToLowerCaseNonAccentVietnamese(x.TaskName).includes(
            ToLowerCaseNonAccentVietnamese(value),
          ),
        )
        if (sortResult.length === 0) {
          ReorderTask([])
        } else {
          ReorderTask(sortResult)
        }
      } else {
        const sortedTask: Tasks[] = JSON.parse(JSON.stringify(task.tasks))
        const inputObjFilter = sortedTask.filter(
          (dataOtherEle) =>
            dataOtherEle.Status.toLowerCase() === 'Completed'.toLowerCase() ||
            //dataOtherEle.Status.toLowerCase() !== 'Done'.toLowerCase() &&
            dataOtherEle.Status.toLowerCase() === 'Incompleted'.toLowerCase(),
        )

        const sortResult: Tasks[] = inputObjFilter.filter((x) =>
          ToLowerCaseNonAccentVietnamese(x.TaskName).includes(
            ToLowerCaseNonAccentVietnamese(value),
          ),
        )
        if (sortResult.length === 0) {
          ReorderClosedTask([])
        } else {
          ReorderClosedTask(sortResult)
        }

        //dispatch(myTaskChange(inputObjFilter.length))
      }
    } else {
      if (showCompleted === false) {
        const sortedTask: Tasks[] = JSON.parse(JSON.stringify(task.tasks))
        const inputObjFilter = sortedTask.filter(
          (dataOtherEle) =>
            dataOtherEle.Status.toLowerCase() !== 'Completed'.toLowerCase() &&
            //dataOtherEle.Status.toLowerCase() !== 'Done'.toLowerCase() &&
            dataOtherEle.Status.toLowerCase() !== 'Incompleted'.toLowerCase(),
        )
        ReorderTask(inputObjFilter)
      } else {
        const sortedTask: Tasks[] = JSON.parse(JSON.stringify(task.tasks))
        const inputObjFilter = sortedTask.filter(
          (dataOtherEle) =>
            dataOtherEle.Status.toLowerCase() === 'Completed'.toLowerCase() ||
            //dataOtherEle.Status.toLowerCase() !== 'Done'.toLowerCase() &&
            dataOtherEle.Status.toLowerCase() === 'Incompleted'.toLowerCase(),
        )
        ReorderClosedTask(inputObjFilter)
        //dispatch(myTaskChange(inputObjFilter.length))
      }
    }
  }

  useEffect(() => {
    try {
      const s = refresh.refresh
      if (refresh.refresh === true) {
        setLoading(true)
      }
    } catch (error) {}
  }, [])

  useEffect(() => {
    dispatch(fetchTasksReporter(params))
  }, [loading])

  useEffect(() => {
    dispatch(reportToMeTaskChange(input.length))
  }, [dataInput.length])

  useEffect(() => {
    if (!task.loading && task.tasks.length) {
      Sorting()
    }
    setLoading(false)
  }, [task.loading, task.tasks.length])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      Sorting()
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [showCompleted])

  useEffect(() => {
    sessionStorage.setItem('searchValueTaskReport', searchValue!)
    const delayDebounceFn = setTimeout(() => {
      Sorting()
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])

  const handleMenuClickStatus: MenuProps['onClick'] = async (e) => {
    //console.log('Hello')
    //await dispatch(fetchTasksReporter(params))
    setLoading(true)
  }

  let data: DataType[] = []
  let noButton = false
  //do some math
  const ShowMore = (startPositon: number, endPosition: number) => {
    setShowMore(false)
  }

  const OnNavigate = (taskData: Tasks) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskData._id, {
      state: {
        search: '/' + taskData._id, // query string
      },
    })
  }

  if (showMore === true) {
    if (isShowMore === false) {
      noButton = false
    } else {
      noButton = true
    }
  }
  return (
    <>
      <Layout>
        <Row>
          <Col span={16}>
            <Input
              prefix={<FontAwesomeIcon icon={faSearch} />}
              placeholder={SEARCH}
              //onPressEnter={(e) => onSearch(e)}
              style={{
                width: '50%',
                border: 'none',
                float: 'left',
                marginBottom: '15px',
              }}
              value={searchValue!}
              //defaultValue={inputValue}
              //onChange={(e) => setInputValue(e.target.value)}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              //onBlur={(e) => InputChange(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Checkbox
              onChange={(e) => {
                const saveBoolean: boolean = e.target.checked
                sessionStorage.setItem(
                  'showClosedTaskReport',
                  Boolean(saveBoolean).toString(),
                )
                setShowCompleted(!showCompleted)
              }}
              style={{ float: 'right' }}
              defaultChecked={
                sessionStorage.getItem('showClosedTaskReport') === 'true'
              }
            >
              Show closed tasks
            </Checkbox>
          </Col>
        </Row>

        {loading === false && (
          <Table
            pagination={false}
            columns={columns}
            dataSource={dataInput}
            scroll={{ y: 500, scrollToFirstRowOnChange: false }}
            size="middle"
          />
        )}
        {noButton === true && (
          <center>
            <br />
            <Button
              type="primary"
              onClick={() => ShowMore(countIndex, inputLength)}
            >
              Show more {data.length}
            </Button>
          </center>
        )}
      </Layout>
    </>
  )
}

export default TaskListOverDue
