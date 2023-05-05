import {
  faCaretDown,
  faCaretRight,
  faEdit,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Collapse, Empty, Row, Space, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ExpandableConfig } from 'antd/es/table/interface'
import ObjectID from 'bson-objectid'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { CustomRoutes } from '../../customRoutes'
import { Tasks } from '../../data/database/Tasks'
import { Users } from '../../data/database/Users'
import {
  FilterRequestWithType,
  FilterResponse,
} from '../../data/interface/FilterInterface'
import { SelectorValue } from '../../data/interface/SelectorValue'
import { Status } from '../../data/interface/Status'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import {
  addManager,
  addTabs,
  fetchFilterResult,
} from '../../redux/features/filter/filterSlice'
import { ACTIVE, PROJECT, UPDATE_MODE, revertAll } from '../../util/ConfigText'
import DateFormatter from '../../util/DateFormatter'
import GetStatusIgnoreList from '../../util/StatusList'
import DropdownProps from '../Dropdown'
import { SearchBar } from '../filter/SearchBar'
import IconGroup from '../IconGroup'
import ParagraphExample from '../ParagraphExample'
import TaskCreation from '../TaskCreation'
import ProjectEnd from './ProjectEnd'

const { Panel } = Collapse

interface CompInput {
  filterResponse: FilterResponse
}

interface ProjectInput {
  tab?: string
}

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  path?: string
  assignee?: React.ReactNode
  reporter?: React.ReactNode
  priority: React.ReactNode
  startDate?: React.ReactNode
  dueDate: React.ReactNode
  score?: React.ReactNode
  children?: DataType[]
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Task',
    dataIndex: 'task',
    align: 'left',
    width: '40%',
  },
  {
    title: 'Assignee',
    dataIndex: 'assignee',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Reporter',
    dataIndex: 'reporter',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center',
    width: '15%',
  },
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    width: '15%',
  },
]

const Comp: React.FC<CompInput> = ({ filterResponse }) => {
  const [dataInput, setDataInput] = useState<DataType[]>([])
  const navigate = useNavigate()

  const customExpandIcon = (props: any) => {
    if (props.expanded) {
      return (
        <a
          style={{ color: 'black', marginRight: '8px' }}
          onClick={(e) => {
            props.onExpand(props.record, e)
          }}
        >
          <FontAwesomeIcon icon={faCaretDown} />
        </a>
      )
    } else {
      if (props.record.children && props.record.children.length !== 0) {
        return (
          <a
            style={{ color: 'black', marginRight: '8px' }}
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </a>
        )
      } else {
        return <div style={{ color: 'black', marginRight: '8px' }}> </div>
      }
    }
  }

  const expandableConfig: ExpandableConfig<DataType> = {
    expandIcon: customExpandIcon,
    //rowExpandable: (record) => record.children === undefined,
    //onExpand: (expanded, record) => console.log('onExpand: ', record, expanded),
  }

  const ReorderTask = (inputTaskList: Tasks[]) => {
    let inputObj: Tasks[] = JSON.parse(JSON.stringify(inputTaskList))
    const inputLength = inputObj.length

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
        new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime(),
    )

    const taskWithDueDate = inputObj
      .filter((data) => data.DueDate !== null)
      .concat(inputObj.filter((data) => data.DueDate === null))

    inputObj = taskWithDueDate
    return inputObj
  }

  const OnNavigate = (taskData: Tasks) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskData._id, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
      },
    })
  }

  const MappingChildrenInner = (task: Tasks) => {
    const _children: DataType[] = []
    if (task.Subtask && task.Subtask.length > 0) {
      ReorderTask(task.Subtask ? task.Subtask : []).forEach((element) => {
        const __ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          element.Assignee[0]._id!,
          element.Reporter._id!,
          element.Status,
        )

        const reporters: Users[] = []
        reporters.push(element.Reporter)

        _children.push({
          key: element._id! + '' + task._id,
          status: (
            <DropdownProps
              type="Status"
              text={element.Status}
              button={false}
              taskId={element._id}
              ignoreStt={__ignoreList}
              task={element}
              mode={UPDATE_MODE}
              //onClickMenu={handleMenuClickStatus}
            />
          ),
          task: (
            <>
              <div onClick={() => OnNavigate(element)}>
                <ParagraphExample
                  name={element.TaskName}
                  task={element}
                  type="Task"
                />
              </div>
            </>
          ),
          assignee: <IconGroup inputList={element.Assignee} />,
          reporter: <IconGroup inputList={reporters} />,
          priority: (
            <>
              <DropdownProps
                type="Priority"
                text={element.Priority}
                button={false}
                taskId={element._id}
                task={element}
                mode={UPDATE_MODE}
              />
            </>
          ),
          dueDate: (
            <DateFormatter
              dateString={element.DueDate!}
              isDateNull={element.DueDate === null}
              task={element}
            />
          ),
        })
      })
    }
    return _children
  }

  const MappingChildren = (task: Tasks) => {
    const _children: DataType[] = []
    if (task.Subtask && task.Subtask.length > 0) {
      ReorderTask(task.Subtask ? task.Subtask : []).forEach((element) => {
        const __ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          element.Assignee[0]._id!,
          element.Reporter._id!,
          element.Status,
        )

        const reporters: Users[] = []
        reporters.push(element.Reporter)

        _children.push({
          key: element._id! + '' + task._id,
          status: (
            <DropdownProps
              type="Status"
              text={element.Status}
              button={false}
              taskId={element._id}
              ignoreStt={__ignoreList}
              task={element}
              mode={UPDATE_MODE}
              //onClickMenu={handleMenuClickStatus}
            />
          ),
          task: (
            <>
              <div onClick={() => OnNavigate(element)}>
                <ParagraphExample
                  name={element.TaskName}
                  task={element}
                  type="Task"
                />
              </div>
            </>
          ),
          assignee: <IconGroup inputList={element.Assignee} />,
          reporter: <IconGroup inputList={reporters} />,
          priority: (
            <>
              <DropdownProps
                type="Priority"
                text={element.Priority}
                button={false}
                taskId={element._id}
                task={element}
                mode={UPDATE_MODE}
              />
            </>
          ),
          dueDate: (
            <DateFormatter
              dateString={element.DueDate!}
              isDateNull={element.DueDate === null}
              task={element}
            />
          ),
          children:
            element.Subtask && element.Subtask.length > 0
              ? MappingChildrenInner(element)
              : undefined,
        })
      })
    }
    return _children
  }

  useEffect(() => {
    const _dataInput: DataType[] = []

    ReorderTask(filterResponse.Tasks ? filterResponse.Tasks : []).forEach(
      (element) => {
        const reporters: Users[] = []
        reporters.push(element.Reporter)

        const _ignoreList: Status[] = GetStatusIgnoreList(
          getCookie('user_id')?.toString()!,
          element.Assignee[0]._id!,
          element.Reporter._id!,
          element.Status,
        )

        _dataInput.push({
          key: element._id!,
          status: (
            <DropdownProps
              type="Status"
              text={element.Status}
              button={false}
              taskId={element._id}
              ignoreStt={_ignoreList}
              task={element}
              mode={UPDATE_MODE}
              //onClickMenu={handleMenuClickStatus}
            />
          ),
          task: (
            <>
              <div onClick={() => OnNavigate(element)}>
                <ParagraphExample
                  name={element.TaskName}
                  task={element}
                  type="Task"
                />
              </div>
            </>
          ),
          assignee: <IconGroup inputList={element.Assignee} />,
          reporter: <IconGroup inputList={reporters} />,
          priority: (
            <>
              <DropdownProps
                type="Priority"
                text={element.Priority}
                button={false}
                taskId={element._id}
                task={element}
                mode={UPDATE_MODE}
              />
            </>
          ),
          dueDate: (
            <DateFormatter
              dateString={element.DueDate!}
              isDateNull={element.DueDate === null}
              task={element}
            />
          ),
          children:
            element.Subtask && element.Subtask.length > 0
              ? MappingChildren(element)
              : undefined,
        })
      },
    )
    setDataInput(_dataInput)
  }, [])

  return (
    <>
      <Table
        rowClassName={(record, index) =>
          record.children === undefined ? 'show' : 'hide'
        }
        expandable={expandableConfig}
        pagination={false}
        columns={columns}
        dataSource={dataInput}
        scroll={{ y: 500, scrollToFirstRowOnChange: false }}
        size="middle"
      />
    </>
  )
}

const Project: React.FC<ProjectInput> = ({ tab }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openProjectEnd, setOpenProjectEnd] = useState(false)
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [projectValue, setProjectValue] = useState<SelectorValue>()
  const [filterResponse, setFilterResponse] = useState<FilterResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [defaultActiveKey, setDefaultActiveKey] = useState<string[]>([])
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(revertAll())
    dispatch(addManager([getCookie('user_id')!]))
    dispatch(addTabs('3'))
  }, [])

  useEffect(() => {
    setLoading(true)
    //generate dummyJson in here
    if (!filterInit.loading && filterInit.filterResponse.length) {
      setFilterResponse(filterInit.filterResponse)
      const _defaultKey: string[] = []
      filterInit.filterResponse.forEach((element) => {
        _defaultKey.push(element.ProjectId!)
      })
      setDefaultActiveKey(_defaultKey)
      setLoading(false)
    } else {
      setFilterResponse([])
      setLoading(false)
    }
  }, [filterInit.loading, filterInit.filterResponse.length])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tab === '3' || filterInit.tabs === '3') {
        setLoading(true)
        //check for any change here
        const filterReq: FilterRequestWithType = {
          filter: filterInit.filter,
          type: PROJECT,
        }
        dispatch(fetchFilterResult(filterReq))
      }
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [filterInit.filter, filterInit.tabs])

  const OnNavigate = (projectID: string) => {
    navigate(CustomRoutes.Project.path + '/' + projectID, {
      state: {
        search: '/' + projectID, // query string
        // location state
      },
    })
  }

  const HeaderStyle = (response: FilterResponse) => (
    <Row align="middle" className="project-row">
      <Col>
        <span style={{ fontWeight: 600 }}>{response.ProjectName}</span>
      </Col>
      {response.Status === ACTIVE ? (
        <>
          <Col>
            <FontAwesomeIcon
              className="edit-icon"
              icon={faEdit}
              style={{
                margin: '0px 0px 0px 10px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation()
                OnNavigate(response.ProjectId!)
              }}
            />
          </Col>
          <Col>
            <Button
              className="project-btn"
              icon={
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{
                    marginRight: '4px',
                  }}
                />
              }
              style={{
                fontSize: '12px',
                height: '28px',
                padding: '2px 8px 2px 8px',
                marginLeft: '10px',
              }}
              onClick={(e) => {
                e.stopPropagation()
                removeCookie('projectId')
                setCookie('projectId', response.ProjectId!)
                setOpen(true)
                setProjectValue({
                  label: response.ProjectName!,
                  value: response.ProjectId!,
                })
              }}
            >
              Task
            </Button>
          </Col>
          <Col flex="auto"></Col>
          <Col>
            <Button
              className="project-end-btn"
              style={{
                fontSize: '12px',
                height: '28px',
                padding: '2px 8px 2px 8px',
                display: 'none',
              }}
              onClick={(e) => {
                e.stopPropagation()
                removeCookie('projectId')
                setCookie('projectId', response.ProjectId!)
                setTasks(response.Tasks ? response.Tasks : [])
                setOpenProjectEnd(true)
                setProjectValue({
                  label: response.ProjectName!,
                  value: response.ProjectId!,
                })
              }}
            >
              Close project
            </Button>
          </Col>
        </>
      ) : (
        <Col flex="auto"></Col>
      )}
    </Row>
  )

  const onChange = (key: string | string[]) => {
    //console.log(key)
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <SearchBar tabs={'3'} projects={[]} status={[]} />
        {!loading ? (
          <>
            {filterResponse.length > 0 ? (
              <Collapse
                defaultActiveKey={defaultActiveKey}
                bordered={false}
                onChange={onChange}
                style={{
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  height: '70vh',
                }}
              >
                {filterResponse.map((element) => {
                  return (
                    <Panel
                      header={HeaderStyle(element)}
                      key={element.ProjectId!}
                      className="panel-row"
                    >
                      <Comp filterResponse={element} />
                    </Panel>
                  )
                })}
              </Collapse>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </>
        ) : (
          <Spin size="large" />
        )}
      </Space>
      <TaskCreation
        openModal={open}
        closeFunc={() => setOpen(false)}
        projectValue={projectValue}
        isProjectFixed={true}
        projectId={getCookie('projectId')}
        id={ObjectID(new Date().getTime()).toHexString()}
      />
      <ProjectEnd
        openModal={openProjectEnd}
        handleOk={function (
          e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        ): void {
          throw new Error('Function not implemented.')
        }}
        project={projectValue ? projectValue : { label: '', value: '' }}
        handleCancel={() => setOpenProjectEnd(false)}
      />
    </div>
  )
}

export default Project
