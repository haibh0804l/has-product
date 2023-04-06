import {
  faCaretDown,
  faCaretRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Collapse, Empty, Space, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ExpandableConfig } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { CustomRoutes } from '../customRoutes'
import { Tasks } from '../data/database/Tasks'
import { Users } from '../data/database/Users'
import {
  FilterRequest,
  FilterRequestWithType,
  FilterResponse,
} from '../data/interface/FilterInterface'
import { SelectorValue } from '../data/interface/SelectorValue'
import { Status } from '../data/interface/Status'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import {
  addManager,
  fetchFilterResult,
} from '../redux/features/filter/filterSlice'
import { PROJECT } from '../util/ConfigText'
import DateFormatter from '../util/DateFormatter'
import GetStatusIgnoreList from '../util/StatusList'
import DropdownProps from './Dropdown'
import { SearchBar } from './filter/SearchBar'
import IconGroup from './IconGroup'
import ParagraphExample from './ParagraphExample'
import TaskCreation from './TaskCreation'

const { Panel } = Collapse

interface CompInput {
  filterResponse: FilterResponse
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
      task.Subtask.map((element) => {
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
      task.Subtask.map((element) => {
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
    filterResponse.Tasks?.map((element) => {
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
    })
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

const Project: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [projectValue, setProjectValue] = useState<SelectorValue>()
  const [filterResponse, setFilterResponse] = useState<FilterResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [defaultActiveKey, setDefaultActiveKey] = useState<string[]>([])
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(addManager([getCookie('user_id')!]))
  }, [])

  useEffect(() => {
    setLoading(true)
    //generate dummyJson in here
    if (!filterInit.loading && filterInit.filterResponse.length) {
      setFilterResponse(filterInit.filterResponse)
      const _defaultKey: string[] = []
      filterInit.filterResponse.map((element) => {
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
      if (filterInit.tabs === '3') {
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

  const HeaderStyle = (response: FilterResponse) => (
    <Space direction="horizontal" align="center">
      <span style={{ fontWeight: 600 }}>{response.ProjectName}</span>
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
        style={{ fontSize: '12px', height: '28px', padding: '2px 8px 2px 8px' }}
        onClick={(e) => {
          e.stopPropagation()
          removeCookie('projectId')
          setProjectId(response.ProjectId!)
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
    </Space>
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
                  height: '80vh',
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
      />
    </div>
  )
}

export default Project
