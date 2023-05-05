import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react'
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
  Space,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import ParagraphExample from '../ParagraphExample'
import { Tasks } from '../../data/database/Tasks'
import DateFormatter from '../../util/DateFormatter'
import IconGroup from '../IconGroup'
import { CustomRoutes } from '../../customRoutes'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'
import { Status } from '../../data/interface/Status'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { reportToMeTaskChange } from '../../redux/features/reportToMeTask/reportToMeTaskSlice'
import { REPORTER, revertAll, UPDATE_MODE } from '../../util/ConfigText'
import GetStatusIgnoreList from '../../util/StatusList'
import {
  addManager,
  addReporter,
  addTabs,
  fetchFilterResult,
} from '../../redux/features/filter/filterSlice'
import { FilterRequestWithType } from '../../data/interface/FilterInterface'
import { SearchBar } from '../filter/SearchBar'
import {
  PriorityCategory,
  StatusCategory,
} from '../../data/database/Categories'
import { ReactElementMapping, Sorter } from './ReactElementMapping'
import { text } from 'stream/consumers'
import { Text } from 'react-bootstrap/lib/Navbar'

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
  const tab = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const refresh = location.state
  const [input, setInput] = useState<Tasks[]>([])
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const [isShowMore, setShowMore] = useState(true)
  const [showCompleted, setShowCompleted] = useState(
    localStorage.getItem('showClosedTaskReport') === 'true',
  )
  const [loading, setLoading] = useState(false)
  const filterInit = useAppSelector((state) => state.filter)
  const statusList = JSON.parse(
    localStorage.getItem('statusData')!,
  ) as StatusCategory[]
  const dispatch = useAppDispatch()

  const styleStatusRead: React.CSSProperties = {
    margin: '0',
    maxWidth: '30vw',
    fontWeight: 'bold',
  }

  const styleStatusUnRead: React.CSSProperties = {
    margin: '0',
    borderLeft: '4px solid #0891B2',
  }
  const [styleborder, setStyleBorder] =
    useState<React.CSSProperties>(styleStatusUnRead)

  const columns: ColumnsType<DataType> = [
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: '5vw',
      render(text, record) {
        return {
          props: {
            style: text.props.children.props.task.ReporterRead
              ? styleStatusRead
              : styleStatusUnRead,
          },
          children: <div>{text}</div>,
        }
      },
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
      // sorter: (a, b) => Sorter(a.project, b.project),
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
      // sorter: (a, b) => Sorter(a.assignee, b.assignee),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
      width: '10vw',
      sorter: (a, b) => Sorter(a.priority, b.priority, ''),
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
      sorter: (a, b) => Sorter(a.dueDate, b.dueDate, 'dueDate'),
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

    /* inputObj.forEach((element) => {
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
    }) */
    inputObj = inputObj.sort(
      (a, b) =>
        new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime() ||
        (a.PriorityCategory as PriorityCategory).Level -
          (b.PriorityCategory as PriorityCategory).Level ||
        new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime(),
    )

    const taskWithDueDate = inputObj
      .filter((data) => data.DueDate !== null)
      .concat(inputObj.filter((data) => data.DueDate === null))

    inputObj = taskWithDueDate

    setInput(inputObj)
    const _data: DataType[] = []
    if (inputLength > 0) {
      for (let index = 0; index < inputLength; index++) {
        const _ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          inputObj[index].Assignee[0]._id!,
          inputObj[index].Reporter._id!,
          (
            inputObj[index].StatusCategory as StatusCategory
          ).CategoryId!.toString(),
        )
        _data.push({
          key: inputObj[index]._id ? index.toString() : index.toString(),
          status: (
            <ReactElementMapping
              customKey={(
                inputObj[index].StatusCategory as StatusCategory
              ).CategoryId!.toString()}
              children={
                <DropdownProps
                  type="Status"
                  text={(
                    inputObj[index].StatusCategory as StatusCategory
                  ).CategoryId!.toString()}
                  button={false}
                  taskId={inputObj[index]._id}
                  ignoreStt={_ignoreList}
                  task={inputObj[index]}
                  onClickMenu={handleMenuClickStatus}
                />
              }
            />
          ),

          task: (
            <ReactElementMapping
              customKey={inputObj[index].TaskName}
              children={
                <div
                  onClick={() => OnNavigate(inputObj[index])}
                  style={{ width: 'auto' }}
                  key={inputObj[index].TaskName}
                >
                  <ParagraphExample
                    type="Task"
                    name={inputObj[index].TaskName}
                    task={inputObj[index]}
                    userType="Reporter"
                    read={inputObj[index].ReporterRead}
                  />
                </div>
              }
            />
          ),
          project: (
            <ReactElementMapping
              customKey={
                inputObj[index].Project?.ProjectName
                  ? inputObj[index].Project?.ProjectName
                  : '-'
              }
              children={
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
              }
            />
          ),
          assignee: <IconGroup inputList={inputObj[index].Assignee} />,
          priority: (
            <ReactElementMapping
              customKey={
                (inputObj[index].PriorityCategory as PriorityCategory).Level
              }
              children={
                <DropdownProps
                  type="Priority"
                  text={(
                    inputObj[index].PriorityCategory as PriorityCategory
                  ).CategoryId!.toString()}
                  button={false}
                  taskId={inputObj[index]._id}
                  task={inputObj[index]}
                />
              }
            />
          ),
          dueDate: (
            <>
              {inputObj[index].DueDate === null ? (
                ''
              ) : (inputObj[index].StatusCategory as StatusCategory)
                  .CategoryId == 3 ||
                (inputObj[index].StatusCategory as StatusCategory).CategoryId ==
                  4 ? (
                inputObj[index].CloseDate! === undefined ? (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div>
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                ) : new Date(inputObj[index].DueDate!) >=
                  new Date(inputObj[index].CloseDate!) ? (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div>
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                ) : (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div className="overdue">
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                )
              ) : new Date() > new Date(inputObj[index].DueDate!) ? (
                <ReactElementMapping
                  customKey={inputObj[index].DueDate}
                  children={
                    <div className="overdue">
                      <DateFormatter
                        dateString={inputObj[index].DueDate!}
                        task={inputObj[index]}
                      />
                    </div>
                  }
                />
              ) : (
                <ReactElementMapping
                  customKey={inputObj[index].DueDate}
                  children={
                    <div>
                      <DateFormatter
                        dateString={inputObj[index].DueDate!}
                        task={inputObj[index]}
                      />
                    </div>
                  }
                />
              )}
            </>
          ),
          score: <p>{inputObj[index].Score ? inputObj[index].Score : '_'}</p>,
        })
        countIndex++
        // console.log(Date.parse(inputObj[index].DueDate!.toString()))
      }
      setDataInput(_data)
    } else {
      if (!filterInit.loading) {
        setDataInput([])
        setInput([])
      }
    }
  }

  const ReorderClosedTask = (inputTaskList: Tasks[]) => {
    let inputObj: Tasks[] = JSON.parse(JSON.stringify(inputTaskList))
    inputLength = inputObj.length

    /* inputObj.forEach((element) => {
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
    }) */
    inputObj = inputObj.sort(
      (a, b) =>
        (a.PriorityCategory as PriorityCategory).Level -
          (b.PriorityCategory as PriorityCategory).Level ||
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
          (
            inputObj[index].StatusCategory as StatusCategory
          ).CategoryId!.toString(),
        )
        _data.push({
          key: inputObj[index]._id ? index.toString() : index.toString(),
          status: (
            <ReactElementMapping
              customKey={(
                inputObj[index].StatusCategory as StatusCategory
              ).CategoryId!.toString()}
              children={
                <DropdownProps
                  type="Status"
                  text={(
                    inputObj[index].StatusCategory as StatusCategory
                  ).CategoryId!.toString()}
                  button={false}
                  taskId={inputObj[index]._id}
                  ignoreStt={_ignoreList}
                  task={inputObj[index]}
                  onClickMenu={handleMenuClickStatus}
                />
              }
            />
          ),

          task: (
            <ReactElementMapping
              customKey={inputObj[index].TaskName}
              children={
                <div
                  onClick={() => OnNavigate(inputObj[index])}
                  style={{ width: 'auto' }}
                  key={inputObj[index].TaskName}
                >
                  <ParagraphExample
                    type="Task"
                    name={inputObj[index].TaskName}
                    task={inputObj[index]}
                    userType="Reporter"
                    read={inputObj[index].ReporterRead}
                  />
                </div>
              }
            />
          ),
          project: (
            <ReactElementMapping
              customKey={
                inputObj[index].Project?.ProjectName
                  ? inputObj[index].Project?.ProjectName
                  : '-'
              }
              children={
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
              }
            />
          ),
          assignee: <IconGroup inputList={inputObj[index].Assignee} />,
          priority: (
            <ReactElementMapping
              customKey={
                (inputObj[index].PriorityCategory as PriorityCategory).Level
              }
              children={
                <DropdownProps
                  type="Priority"
                  text={(
                    inputObj[index].PriorityCategory as PriorityCategory
                  ).CategoryId!.toString()}
                  button={false}
                  taskId={inputObj[index]._id}
                  task={inputObj[index]}
                />
              }
            />
          ),
          dueDate: (
            <>
              {inputObj[index].DueDate === null ? (
                ''
              ) : (inputObj[index].StatusCategory as StatusCategory)
                  .CategoryId == 3 ||
                (inputObj[index].StatusCategory as StatusCategory).CategoryId ==
                  4 ? (
                inputObj[index].CloseDate! === undefined ? (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div>
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                ) : new Date(inputObj[index].DueDate!) >=
                  new Date(inputObj[index].CloseDate!) ? (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div>
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                ) : (
                  <ReactElementMapping
                    customKey={inputObj[index].DueDate}
                    children={
                      <div className="overdue">
                        <DateFormatter
                          dateString={inputObj[index].DueDate!}
                          task={inputObj[index]}
                        />
                      </div>
                    }
                  />
                )
              ) : new Date() > new Date(inputObj[index].DueDate!) ? (
                <ReactElementMapping
                  customKey={inputObj[index].DueDate}
                  children={
                    <div className="overdue">
                      <DateFormatter
                        dateString={inputObj[index].DueDate!}
                        task={inputObj[index]}
                      />
                    </div>
                  }
                />
              ) : (
                <ReactElementMapping
                  customKey={inputObj[index].DueDate}
                  children={
                    <div>
                      <DateFormatter
                        dateString={inputObj[index].DueDate!}
                        task={inputObj[index]}
                      />
                    </div>
                  }
                />
              )}
            </>
          ),
          score: <p>{inputObj[index].Score ? inputObj[index].Score : '_'}</p>,
        })
        countIndex++
      }
      setDataInput(_data)
    } else {
      if (!filterInit.loading) {
        setDataInput([])
        setInput([])
      }
    }
  }

  useEffect(() => {
    dispatch(revertAll())
    dispatch(addManager([]))
    dispatch(addReporter([getCookie('user_id')!]))
    dispatch(addTabs('2'))
    try {
      const s = refresh.refresh
      if (refresh.refresh === true) {
        setLoading(true)
      }
    } catch (error) {}
  }, [])

  useEffect(() => {
    setLoading(true)
    //generate dummyJson in here
    if (filterInit.tabs === '2') {
      if (!filterInit.loading) {
        if (filterInit.filterResponse.length) {
          if (filterInit.filterResponse.length === 0) {
            setInput([])
            ReorderTask([])
            setLoading(false)
          } else {
            if (filterInit.filter.completed) {
              setShowCompleted(true)
              setInput(filterInit.filterResponse as Tasks[])
              ReorderClosedTask(filterInit.filterResponse as Tasks[])
              setLoading(false)
            } else {
              setShowCompleted(false)
              setInput(filterInit.filterResponse as Tasks[])
              ReorderTask(filterInit.filterResponse as Tasks[])
              setLoading(false)
            }
            dispatch(reportToMeTaskChange(filterInit.filterResponse.length))
          }
        } else {
          dispatch(reportToMeTaskChange(0))
          setInput([])
          ReorderTask([])
          setLoading(false)
        }
      }
    }
  }, [filterInit.loading, filterInit.filterResponse.length])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tab.id && tab.id === '2') {
        setLoading(true)
        //check for any change here
        const filterReq: FilterRequestWithType = {
          filter: filterInit.filter,
          type: REPORTER,
        }
        dispatch(fetchFilterResult(filterReq))
      } else {
        if (filterInit.tabs === '2') {
          setLoading(true)
          //check for any change here
          const filterReq: FilterRequestWithType = {
            filter: filterInit.filter,
            type: REPORTER,
          }
          dispatch(fetchFilterResult(filterReq))
        }
      }
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [filterInit.filter, filterInit.tabs])

  const handleMenuClickStatus: MenuProps['onClick'] = async (e) => {
    //console.log('Hello')
    //await dispatch(fetchTasksReporter(params))
    //setLoading(true)
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchBar tabs={'2'} projects={[]} status={[]} />

        {loading === false ? (
          <Table
            pagination={false}
            columns={columns}
            dataSource={dataInput}
            scroll={{ y: 500, scrollToFirstRowOnChange: false }}
            size="middle"
          />
        ) : (
          <Spin size="large" />
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
      </Space>
    </>
  )
}

export default TaskListOverDue
