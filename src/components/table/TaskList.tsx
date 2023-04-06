import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Table,
  Layout,
  Button,
  Input,
  Checkbox,
  Spin,
  Modal,
  MenuProps,
  Row,
  Col,
  Space,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import { Tasks } from '../../data/database/Tasks'
import ParagraphExample from '../ParagraphExample'
import DateFormatter from '../../util/DateFormatter'
import { useLocation, useNavigate } from 'react-router-dom'
import { CustomRoutes } from '../../customRoutes'
import { Status } from '../../data/interface/Status'
import { getCookie } from 'typescript-cookie'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import GetStatusIgnoreList from '../../util/StatusList'
import { ASSIGNEE, SEARCH } from '../../util/ConfigText'
import {
  FilterRequest,
  FilterRequestWithType,
} from '../../data/interface/FilterInterface'
import { SearchBar } from '../filter/SearchBar'
import {
  addAssignee,
  addManager,
  fetchFilterResult,
} from '../../redux/features/filter/filterSlice'
import { myTaskChange } from '../../redux/features/myTask/myTaskSlice'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  project: React.ReactNode
  path?: string
  priority: React.ReactNode
  startDate?: React.ReactNode
  dueDate: React.ReactNode
  score?: React.ReactNode
}

interface InputData {
  inputData?: Tasks[]
  showMore: boolean
  increment: number
  collapseShowMore: boolean
  onChangeValue?: (e: any) => void
}

let countIndex = 0
let inputLength = 0

const TaskList: React.FC<InputData> = ({ showMore, collapseShowMore }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const refresh = location.state
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState<Tasks[]>([])

  const [isShowMore, setShowMore] = useState(collapseShowMore)
  const [showCompleted, setShowCompleted] = useState(
    sessionStorage.getItem('showClosedTaskList') === 'true',
  )
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const [dataSplice, setDataSplice] = useState<DataType[]>([])
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

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
      width: '35vw',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      width: '20vw',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
      width: '13vw',
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      width: '10vw',
    },
    {
      ...(showCompleted
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
    const _data: DataType[] = []
    const _dataSplice: DataType[] = []
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
        new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime(),
    )

    const urgentTask = inputObj
      .filter(
        (data) =>
          data.PriorityNum === 1 &&
          data.DueDate !== null &&
          new Date(data.DueDate!).getTime() >= new Date().getTime(),
      )
      .sort(
        (a, b) =>
          new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
      )
      .concat(
        inputObj
          .filter(
            (data) =>
              data.PriorityNum === 1 &&
              data.DueDate !== null &&
              new Date(data.DueDate!).getTime() < new Date().getTime(),
          )
          .sort(
            (a, b) =>
              new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
          ),
      )

      .concat(
        inputObj.filter(
          (data) => data.PriorityNum === 1 && data.DueDate === null,
        ),
      )

    const highTask = inputObj
      .filter(
        (data) =>
          data.PriorityNum === 2 &&
          data.DueDate !== null &&
          new Date(data.DueDate!).getTime() >= new Date().getTime(),
      )
      .sort(
        (a, b) =>
          new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
      )
      .concat(
        inputObj
          .filter(
            (data) =>
              data.PriorityNum === 2 &&
              data.DueDate !== null &&
              new Date(data.DueDate!).getTime() < new Date().getTime(),
          )
          .sort(
            (a, b) =>
              new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
          ),
      )
      .concat(
        inputObj.filter(
          (data) => data.PriorityNum === 2 && data.DueDate === null,
        ),
      )

    const mediumTask = inputObj
      .filter(
        (data) =>
          data.PriorityNum === 3 &&
          data.DueDate !== null &&
          new Date(data.DueDate!).getTime() >= new Date().getTime(),
      )
      .sort(
        (a, b) =>
          new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
      )
      .concat(
        inputObj
          .filter(
            (data) =>
              data.PriorityNum === 3 &&
              data.DueDate !== null &&
              new Date(data.DueDate!).getTime() < new Date().getTime(),
          )
          .sort(
            (a, b) =>
              new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
          ),
      )
      .concat(
        inputObj.filter(
          (data) => data.PriorityNum === 3 && data.DueDate === null,
        ),
      )

    const lowTask = inputObj
      .filter(
        (data) =>
          data.PriorityNum === 4 &&
          data.DueDate !== null &&
          new Date(data.DueDate!).getTime() >= new Date().getTime(),
      )
      .sort(
        (a, b) =>
          new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
      )
      .concat(
        inputObj
          .filter(
            (data) =>
              data.PriorityNum === 4 &&
              data.DueDate !== null &&
              new Date(data.DueDate!).getTime() < new Date().getTime(),
          )
          .sort(
            (a, b) =>
              new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
          ),
      )
      .concat(
        inputObj.filter(
          (data) => data.PriorityNum === 4 && data.DueDate === null,
        ),
      )

    const undefinedTask = inputObj
      .filter(
        (data) =>
          data.PriorityNum === 5 &&
          data.DueDate !== null &&
          new Date(data.DueDate!).getTime() >= new Date().getTime(),
      )
      .sort(
        (a, b) =>
          new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
      )
      .concat(
        inputObj
          .filter(
            (data) =>
              data.PriorityNum === 5 &&
              data.DueDate !== null &&
              new Date(data.DueDate!).getTime() < new Date().getTime(),
          )
          .sort(
            (a, b) =>
              new Date(a.DueDate!).getTime() - new Date(b.DueDate!).getTime(),
          ),
      )
      .concat(
        inputObj.filter(
          (data) => data.PriorityNum === 5 && data.DueDate === null,
        ),
      )

    inputObj = urgentTask.concat(
      highTask.concat(mediumTask.concat(lowTask.concat(undefinedTask))),
    )

    setInput(inputObj)

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
          project: (
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
          ),

          task: (
            <>
              <div onClick={() => OnNavigate(inputObj[index])}>
                <ParagraphExample
                  type="Task"
                  name={inputObj[index].TaskName}
                  task={inputObj[index]}
                />
              </div>
            </>
          ),
          priority: (
            <>
              <DropdownProps
                type="Priority"
                text={inputObj[index].Priority}
                button={false}
                taskId={inputObj[index]._id}
                task={inputObj[index]}
              />
            </>
          ),
          dueDate: (
            <>
              {inputObj[index].DueDate === null ? (
                ''
              ) : inputObj[index].Status === 'Completed' ||
                inputObj[index].Status === 'Incompleted' ? (
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

        if (index < 3) {
          _dataSplice.push({
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
            project: (
              <ParagraphExample
                name={
                  inputObj[index].Project
                    ? inputObj[index].Project?.ProjectName
                    : '-'
                }
                task={inputObj[index]}
              />
            ),
            task: (
              <>
                <div
                  onClick={() => OnNavigate(inputObj[index])}
                  style={{ width: 'auto' }}
                >
                  <ParagraphExample
                    type="Task"
                    name={inputObj[index].TaskName}
                    task={inputObj[index]}
                  />
                </div>
              </>
            ),
            priority: (
              <>
                <DropdownProps
                  type="Priority"
                  text={inputObj[index].Priority}
                  button={false}
                  taskId={inputObj[index]._id}
                  task={inputObj[index]}
                />
              </>
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
        }
        countIndex++
      }

      setDataSplice(_dataSplice)
      setDataInput(_data)
    } else {
      if (!filterInit.loading) {
        setDataInput([])
        setInput([])
        setDataSplice([])
      }
    }
  }

  const ReorderClosedTasks = (inputTaskList: Tasks[]) => {
    const _data: DataType[] = []
    const _dataSplice: DataType[] = []

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
        new Date(b.CloseDate ? b.CloseDate : new Date()).getTime() -
          new Date(a.CloseDate ? a.CloseDate : new Date()).getTime(),
    )

    setInput(inputObj)

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
                type="Task"
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
          priority: (
            <>
              <DropdownProps
                type="Priority"
                text={inputObj[index].Priority}
                button={false}
                taskId={inputObj[index]._id}
                task={inputObj[index]}
              />
            </>
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
        if (index < 3) {
          _dataSplice.push({
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
                  type="Task"
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
            priority: (
              <>
                <DropdownProps
                  type="Priority"
                  text={inputObj[index].Priority}
                  button={false}
                  taskId={inputObj[index]._id}
                  task={inputObj[index]}
                />
              </>
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
        }
        countIndex++
      }

      setDataSplice(_dataSplice)
      setDataInput(_data)
    } else {
      if (!filterInit.loading && filterInit.filterResponse.length) {
        setDataInput([])
        setInput([])
        setDataSplice([])
      }
    }
  }

  const handleMenuClickStatus: MenuProps['onClick'] = (e) => {
    setLoading(true)
  }

  useEffect(() => {
    dispatch(addManager([]))
    dispatch(addAssignee([getCookie('user_id')!]))
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
    if (filterInit.tabs === '1') {
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
              ReorderClosedTasks(filterInit.filterResponse as Tasks[])
              setLoading(false)
            } else {
              setShowCompleted(false)
              setInput(filterInit.filterResponse as Tasks[])
              ReorderTask(filterInit.filterResponse as Tasks[])
              setLoading(false)
            }
            dispatch(myTaskChange(filterInit.filterResponse.length))
          }
        } else {
          setInput([])
          ReorderTask([])
          setLoading(false)
        }
      }
    }
  }, [filterInit.loading, filterInit.filterResponse.length])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (filterInit.tabs === '1') {
        setLoading(true)
        //check for any change here
        const filterReq: FilterRequestWithType = {
          filter: filterInit.filter,
          type: ASSIGNEE,
        }
        dispatch(fetchFilterResult(filterReq))
      }
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [filterInit.filter, filterInit.tabs])

  let noButton = false
  const ShowMore = () => {
    setShowMore(false)
  }

  const OnNavigate = (taskData: Tasks) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskData._id, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
      },
    })
  }

  if (showMore === true) {
    if (isShowMore === false) {
      noButton = false
    } else if (dataInput.length < 3) {
      noButton = false
    } else {
      noButton = true
    }
  }

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchBar tabs={'1'} projects={[]} status={[]} />
        {loading === false ? (
          <>
            <Table
              pagination={false}
              columns={columns}
              dataSource={isShowMore === true ? dataSplice : dataInput}
              scroll={{
                y: 500,
                scrollToFirstRowOnChange: false,
              }}
              size="middle"
            />
            {noButton === true && (
              <center className="show-more-btn">
                <br />
                <Button onClick={() => ShowMore()}>Show more</Button>
              </center>
            )}
          </>
        ) : (
          <Spin />
        )}
      </Space>
    </>
  )
}

export default memo(TaskList)
