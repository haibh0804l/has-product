import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Spin, MenuProps, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import { Tasks } from '../../data/database/Tasks'
import ParagraphExample from '../ParagraphExample'
import DateFormatter from '../../util/DateFormatter'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CustomRoutes } from '../../customRoutes'
import { Status } from '../../data/interface/Status'
import { getCookie } from 'typescript-cookie'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import GetStatusIgnoreList from '../../util/StatusList'
import { ASSIGNEE, revertAll } from '../../util/ConfigText'
import { FilterRequestWithType } from '../../data/interface/FilterInterface'
import { SearchBar } from '../filter/SearchBar'
import {
  addAssignee,
  addManager,
  addTabs,
  fetchFilterResult,
} from '../../redux/features/filter/filterSlice'
import { myTaskChange } from '../../redux/features/myTask/myTaskSlice'
import { PriorityCategory } from '../../data/database/Categories'
import { StatusCategory } from '../../data/database/Categories'
import { ReactElementMapping, Sorter } from './ReactElementMapping'
import { log } from 'console'
import { isBuffer } from 'lodash'

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
  const tab = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const refresh = location.state
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState<Tasks[]>([])

  const [isShowMore, setShowMore] = useState(collapseShowMore)
  const [showCompleted, setShowCompleted] = useState(
    localStorage.getItem('showClosedTaskList') === 'true',
  )
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const [dataSplice, setDataSplice] = useState<DataType[]>([])
  const filterInit = useAppSelector((state) => state.filter)
  const filterValue = useAppSelector((state) => state.userValue)
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
            style: text.props.children.props.task.AssigneeRead
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
      width: '35vw',

      // sorter: (a, b) => Sorter(a.task, b.task),
    },
    {
      title: 'Project',
      dataIndex: 'project',
      width: '20vw',
      // sorter: (a, b) => Sorter(a.project, b.project),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      align: 'center',
      width: '13vw',
      sorter: (a, b) => Sorter(a.priority, b.priority, ''),
      // sorter: (a, b) => {
      //   console.log(a)
      //   return 0
      // },
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      width: '10vw',
      sorter: (a, b) => Sorter(a.dueDate, b.dueDate, 'dueDate'),
      // sorter: (a, b) => {
      //   console.log(a)
      //   return 0
      // },
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

    /* inputObj.forEach((element) => {
      if (element.Priority === 'Urgent') {
        element.PriorityCategory = 1
      } else if (element.Priority === 'High') {
        element.PriorityCategory = 2
      } else if (element.Priority === 'Medium') {
        element.PriorityCategory = 3
      } else if (element.Priority === 'Low') {
        element.PriorityCategory = 4
      } else {
        element.PriorityCategory = 5
      }
    }) */

    inputObj = inputObj.sort(
      (a, b) =>
        (a.PriorityCategory as PriorityCategory).Level -
          (b.PriorityCategory as PriorityCategory).Level ||
        new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime(),
    )

    const urgentTask = inputObj
      .filter(
        (data) =>
          (data.PriorityCategory as PriorityCategory).CategoryId == 8 &&
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
              (data.PriorityCategory as PriorityCategory).CategoryId == 8 &&
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
          (data) =>
            (data.PriorityCategory as PriorityCategory).CategoryId == 8 &&
            data.DueDate === null,
        ),
      )

    const highTask = inputObj
      .filter(
        (data) =>
          (data.PriorityCategory as PriorityCategory).CategoryId == 7 &&
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
              (data.PriorityCategory as PriorityCategory).CategoryId == 7 &&
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
          (data) =>
            (data.PriorityCategory as PriorityCategory).CategoryId == 7 &&
            data.DueDate === null,
        ),
      )

    const mediumTask = inputObj
      .filter(
        (data) =>
          (data.PriorityCategory as PriorityCategory).CategoryId == 6 &&
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
              (data.PriorityCategory as PriorityCategory).CategoryId == 6 &&
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
          (data) =>
            (data.PriorityCategory as PriorityCategory).CategoryId == 6 &&
            data.DueDate === null,
        ),
      )

    const lowTask = inputObj
      .filter(
        (data) =>
          (data.PriorityCategory as PriorityCategory).CategoryId == 5 &&
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
              (data.PriorityCategory as PriorityCategory).CategoryId == 5 &&
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
          (data) =>
            (data.PriorityCategory as PriorityCategory).CategoryId == 5 &&
            data.DueDate === null,
        ),
      )

    const undefinedTask = inputObj
      .filter(
        (data) =>
          (data.PriorityCategory as PriorityCategory).CategoryId == 4 &&
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
              (data.PriorityCategory as PriorityCategory).CategoryId == 4 &&
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
          (data) =>
            (data.PriorityCategory as PriorityCategory).CategoryId == 4 &&
            data.DueDate === null,
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
                  parentTask={inputObj[index].ParentTask as Tasks}
                  onClickMenu={handleMenuClickStatus}
                />
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
                    userType="Assignee"
                    read={inputObj[index].AssigneeRead}
                  />
                </div>
              }
            />
          ),
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

        if (index < 3) {
          _dataSplice.push({
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
                      userType="Assignee"
                      read={inputObj[index].AssigneeRead}
                    />
                  </div>
                }
              />
            ),
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
                    .CategoryId == 4 ||
                  (inputObj[index].StatusCategory as StatusCategory)
                    .CategoryId == 3 ? (
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

    /*  inputObj.forEach((element) => {
      if (element.Priority === 'Urgent') {
        element.PriorityCategory = 1
      } else if (element.Priority === 'High') {
        element.PriorityCategory = 2
      } else if (element.Priority === 'Medium') {
        element.PriorityCategory = 3
      } else if (element.Priority === 'Low') {
        element.PriorityCategory = 4
      } else {
        element.PriorityCategory = 5
      }
    }) */

    inputObj = inputObj.sort(
      (a, b) =>
        (a.PriorityCategory as PriorityCategory).Level -
          (b.PriorityCategory as PriorityCategory).Level ||
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
                    userType="Assignee"
                    read={inputObj[index].AssigneeRead}
                  />
                </div>
              }
            />
          ),
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
        if (index < 3) {
          _dataSplice.push({
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
                      userType="Assignee"
                      read={inputObj[index].AssigneeRead}
                    />
                  </div>
                }
              />
            ),
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
                  (inputObj[index].StatusCategory as StatusCategory)
                    .CategoryId == 4 ? (
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
    //setLoading(true)
  }

  useEffect(() => {
    dispatch(revertAll())
    dispatch(addManager([]))
    dispatch(addAssignee([getCookie('user_id')!]))
    dispatch(addTabs('1'))
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
          dispatch(myTaskChange(0))
          setInput([])
          ReorderTask([])
          setLoading(false)
        }
      }
    }
  }, [filterInit.loading, filterInit.filterResponse.length])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tab.id && tab.id === '1') {
        setLoading(true)
        //check for any change here
        const filterReq: FilterRequestWithType = {
          filter: filterInit.filter,
          type: ASSIGNEE,
        }
        dispatch(fetchFilterResult(filterReq))
      } else {
        if (filterInit.tabs === '1') {
          setLoading(true)
          //check for any change here
          const filterReq: FilterRequestWithType = {
            filter: filterInit.filter,
            type: ASSIGNEE,
          }
          dispatch(fetchFilterResult(filterReq))
        }
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

export default TaskList
