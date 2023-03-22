import React, { useCallback, useEffect, useState } from 'react'
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
import { Params } from '../../data/interface/task'
import { fetchTasksAssignee } from '../../redux/features/tasks/assigneeTaskSlice'
import { myTaskChange } from '../../redux/features/myTask/myTaskSlice'
import GetStatusIgnoreList from '../../util/StatusList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
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
  const [searchValue, setSearchValue] = useState(
    sessionStorage.getItem('searchValueTaskList')
      ? sessionStorage.getItem('searchValueTaskList')
      : '',
  )
  const [showCompleted, setShowCompleted] = useState(
    sessionStorage.getItem('showClosedTaskList') === 'true',
  )
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const [dataSplice, setDataSplice] = useState<DataType[]>([])
  const task = useAppSelector((state) => state.assigneeTasks)
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
      width: '35vw',
    },
    /* {
    title: 'Path',
    dataIndex: 'path',
    width: '14vw',
  }, */
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
      width: '13vw',
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
      .concat(
        inputObj.filter(
          (data) =>
            data.PriorityNum === 1 &&
            data.DueDate !== null &&
            new Date(data.DueDate!).getTime() < new Date().getTime(),
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
      .concat(
        inputObj.filter(
          (data) =>
            data.PriorityNum === 2 &&
            data.DueDate !== null &&
            new Date(data.DueDate!).getTime() < new Date().getTime(),
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
      .concat(
        inputObj.filter(
          (data) =>
            data.PriorityNum === 3 &&
            data.DueDate !== null &&
            new Date(data.DueDate!).getTime() < new Date().getTime(),
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
      .concat(
        inputObj.filter(
          (data) =>
            data.PriorityNum === 4 &&
            data.DueDate !== null &&
            new Date(data.DueDate!).getTime() < new Date().getTime(),
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
      .concat(
        inputObj.filter(
          (data) =>
            data.PriorityNum === 5 &&
            data.DueDate !== null &&
            new Date(data.DueDate!).getTime() < new Date().getTime(),
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
          task: (
            <>
              <div onClick={() => OnNavigate(inputObj[index])}>
                <ParagraphExample
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
              ) : new Date(inputObj[index].DueDate!) < new Date() ? (
                <div className="overdue">
                  <DateFormatter dateString={inputObj[index].DueDate!} />
                </div>
              ) : (
                <div>
                  <DateFormatter dateString={inputObj[index].DueDate!} />
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
              <>
                <div onClick={() => OnNavigate(inputObj[index])}>
                  <ParagraphExample
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
                ) : new Date(inputObj[index].DueDate!) < new Date() ? (
                  <div className="overdue">
                    <DateFormatter dateString={inputObj[index].DueDate!} />
                  </div>
                ) : (
                  <div>
                    <DateFormatter dateString={inputObj[index].DueDate!} />
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
      if (!task.loading && task.tasks.length) {
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
                name={inputObj[index].TaskName}
                task={inputObj[index]}
              />
            </div>
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
              ) : new Date(inputObj[index].DueDate!) < new Date() ? (
                <div className="overdue">
                  <DateFormatter dateString={inputObj[index].DueDate!} />
                </div>
              ) : (
                <div>
                  <DateFormatter dateString={inputObj[index].DueDate!} />
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
                  name={inputObj[index].TaskName}
                  task={inputObj[index]}
                />
              </div>
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
                ) : new Date(inputObj[index].DueDate!) < new Date() ? (
                  <div className="overdue">
                    <DateFormatter dateString={inputObj[index].DueDate!} />
                  </div>
                ) : (
                  <div>
                    <DateFormatter dateString={inputObj[index].DueDate!} />
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
      if (!task.loading && task.tasks.length) {
        setDataInput([])
        setInput([])
        setDataSplice([])
      }
    }
  }

  const handleMenuClickStatus: MenuProps['onClick'] = (e) => {
    setLoading(true)
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
          ReorderClosedTasks([])
        } else {
          ReorderClosedTasks(sortResult)
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
        ReorderClosedTasks(inputObjFilter)
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
    dispatch(fetchTasksAssignee(params))
  }, [loading])

  useEffect(() => {
    dispatch(myTaskChange(input.length))
  }, [dataInput.length])

  useEffect(() => {
    if (!task.loading && task.tasks.length) {
      Sorting()
    }
    setLoading(false)
  }, [task.loading, task.tasks.length])

  useEffect(() => {
    //let value = searchValue!
    const delayDebounceFn = setTimeout(() => {
      Sorting()
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [showCompleted])

  useEffect(() => {
    sessionStorage.setItem('searchValueTaskList', searchValue!)
    //let value = searchValue!
    const delayDebounceFn = setTimeout(() => {
      Sorting()
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])

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
      <Layout>
        <Row>
          <Col span={16}>
            <Input
              prefix={<FontAwesomeIcon icon={faSearch} />}
              placeholder="Tìm task"
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
                  'showClosedTaskList',
                  Boolean(saveBoolean).toString(),
                )

                setShowCompleted(!showCompleted)
              }}
              style={{ float: 'right' }}
              defaultChecked={
                sessionStorage.getItem('showClosedTaskList') === 'true'
              }
            >
              Show closed tasks
            </Checkbox>
          </Col>
        </Row>

        {loading === false ? (
          <Table
            pagination={false}
            columns={columns}
            dataSource={isShowMore === true ? dataSplice : dataInput}
            scroll={{ y: 500, scrollToFirstRowOnChange: false }}
            size="middle"
          />
        ) : (
          <Spin />
        )}
        {noButton === true && (
          <center className="show-more-btn">
            <br />
            <Button onClick={() => ShowMore()}>Show more</Button>
          </center>
        )}
      </Layout>
    </>
  )
}

export default TaskList
