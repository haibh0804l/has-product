import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  MenuProps,
  Modal,
  Popconfirm,
  Row,
  Spin,
  notification,
} from 'antd'
import { Dropdown, Space } from 'antd'
import FindIcon from '../data/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFlag,
  faSquare,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { GetTasksById, UpdateTask } from '../data/services/tasksService'
import {
  HIDE,
  INSERT_MODE,
  PRIORITY,
  PROJECT_WARNING,
  STATUS,
  UPDATE_FAIL,
  UPDATE_MODE,
} from '../util/ConfigText'
import { Status } from '../data/interface/Status'
import { Tasks } from '../data/database/Tasks'
import { InputTasks } from '../data/database/InputTasks'
import ScoreComp from './ScoreComponent'
import GetReviewAndScoreDisplay from '../util/ReviewAndScore'
import { getCookie } from 'typescript-cookie'
import { ScoreCompProp } from '../data/interface/ScoreCompProps'
import { TaskDetailsProps } from '../data/interface/ComponentsJson'
import Auth from '../util/Auth'
import GetStatusIgnoreList from '../util/StatusList'
import { PriorityCategory, StatusCategory } from '../data/database/Categories'
import RejectModal from './RejectModal'
import { ExclamationCircleFilled } from '@ant-design/icons'
import Table, { ColumnsType } from 'antd/es/table'
import TaskWarningModal from './TaskWarningModal'

const { confirm } = Modal

interface Type {
  type: string
  text: string
  button?: boolean
  id?: string
  taskId?: string
  ignoreStt?: Status[]
  onClickMenu?: (e: any) => void
  mode?: string
  task?: Tasks
  parentTask?: Tasks
  disabled?: boolean
}

interface NumberOfTasksInput {
  statusCategoryId: number
  taskLength: number
}

interface DataType {
  key?: string
  status?: React.ReactNode
  numberOfTask?: React.ReactNode
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'left',
    width: '70%',
  },
  {
    title: 'Task',
    dataIndex: 'numberOfTask',
    align: 'center',
    width: '30%',
  },
]

const DropdownProps: React.FC<Type> = ({
  type,
  text,
  button,
  id,
  taskId,
  ignoreStt,
  onClickMenu,
  mode,
  task,
  parentTask,
  disabled,
}) => {
  const [items, setItems] = useState<MenuProps['items']>([])
  const [loading, setLoading] = useState(false)

  const [newStatus, setNewStatus] = useState('')
  const [miniModal, setMiniModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [defaultScore, setDefaultScore] = useState(0)
  const [score, setScore] = useState(false)
  const [disableComp, setDisableComp] = useState(false)
  const [ignoreSttList, setIgnoreSttList] = useState<Status[]>(
    ignoreStt ? ignoreStt : [],
  )
  const [openWarning, setOpenWarning] = useState(false)
  const [taskValue, setTaskValue] = useState<Tasks>()

  const _status = JSON.parse(
    localStorage.getItem('statusData')!,
  ) as StatusCategory[]
  const _priority = JSON.parse(
    localStorage.getItem('priorityData')!,
  ) as PriorityCategory[]

  useEffect(() => {
    if (mode && mode !== INSERT_MODE) {
      if (task && task.TaskName !== '') {
        let managers: string[] = []
        if (task.Project) {
          managers = task.Project.Manager!
        }
        const props: TaskDetailsProps = Auth(
          getCookie('user_id')!,
          task.Assignee[0]._id!,
          task.Reporter._id!,
          managers,
        )
        if (type === 'Status') {
          setDisableComp(props.isStatusReadOnly)
        } else {
          setDisableComp(props.isPriorityReadOnly)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (ignoreStt) {
      setIgnoreSttList(ignoreStt)
    }
  }, [ignoreStt])

  useEffect(() => {
    if (type === 'Priority') {
      setItems(MapPriority(_priority))
    } else {
      setItems(MapStatus(_status))
    }
  }, [type, ignoreSttList])

  const OnCloseFunc = () => {
    setMiniModal(false)
  }

  const OnCloseReject = () => {
    setRejectModal(false)
  }

  const MapStatus = (stt: StatusCategory[]) => {
    if (ignoreSttList !== undefined) {
      const _items: MenuProps['items'] = []
      const r = stt.filter(
        (elem) => !ignoreSttList.find(({ id }) => elem.CategoryId === id),
      )

      r.forEach((element) => {
        _items?.push(
          {
            label: (
              <>
                <Space>
                  <FontAwesomeIcon icon={faSquare} color={element.Color} />
                  <h4>{element.Name}</h4>
                </Space>
              </>
            ),
            key: element.CategoryId + '',
            onClick: (e) => getStatusValue(e.key),
          },
          {
            type: 'divider',
          },
        )
      })
      //items = status
      return _items
    } else {
      const _items: MenuProps['items'] = []

      stt.forEach((element) => {
        _items?.push(
          {
            label: (
              <>
                <Space>
                  <FontAwesomeIcon icon={faSquare} color={element.Color} />
                  <h4>{element.Name}</h4>
                </Space>
              </>
            ),
            key: element.CategoryId + '',
            onClick: (e) => getStatusValue(e.key),
          },
          {
            type: 'divider',
          },
        )
      })
      //items = status
      return _items
    }
  }

  const MapPriority = (pr: PriorityCategory[]) => {
    const _priorityItems: MenuProps['items'] = []
    pr.forEach((element) => {
      const _key = element.CategoryId + ''
      _priorityItems.push(
        {
          label: (
            <>
              <Space size="small" align="center">
                <FontAwesomeIcon icon={faFlag} color={element.Color} />
                <h4>{element.Name}</h4>
              </Space>
            </>
          ),
          key: _key,
          onClick: (e) => getPriorityValue(e.key),
        },
        {
          type: 'divider',
        },
      )
    })
    return _priorityItems
  }

  if (button === undefined) {
    button = true
  }
  const [txt, setTxt] = useState(text)
  const [itemType, setItemType] = useState(type)
  useEffect(() => {
    setTxt(text)
  }, [text])

  useEffect(() => {
    setItemType(type)
  }, [type])

  const showComletedConfirmSubtask = (okCancel: boolean) => {
    confirm({
      okCancel: okCancel,
      okText: 'Cancel',
      title: 'Cảnh báo',
      icon: <ExclamationCircleFilled />,
      content: 'Không được chuyển trạng thái khi công việc chính đã hoàn thành',
      onOk() {},
      onCancel() {},
    })
  }

  async function updateService(
    inputTask: InputTasks,
    taskId: string,
    sttValue?: string,
  ) {
    if (taskId !== undefined) {
      setLoading(true)
      await UpdateTask('/api/task/', taskId, inputTask)
        .then((r) => {
          if (type !== 'Priority') {
            const _ignoreList: Status[] = GetStatusIgnoreList(
              getCookie('user_id')?.toString()!,
              task?.Assignee[0]._id!,
              task?.Reporter._id!,
              sttValue!,
            )
            setIgnoreSttList(_ignoreList)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          notification.open({
            message: 'Notification',
            description: UPDATE_FAIL,
            duration: 2,
            onClick: () => {
              //console.log('Notification Clicked!')
            },
          })
        })
    }
  }

  function getPriorityValue(value: string) {
    setTxt(value)
    //console.log('To priority ' + value)
    //call update service

    const _id = _priority.filter(
      (element) =>
        element.CategoryId == +value &&
        element.Type.toLowerCase() === PRIORITY.toLowerCase(),
    )[0]._id
    const inputTask: InputTasks = {
      PriorityCategory: _id,
    }
    if (mode === undefined || mode === UPDATE_MODE) {
      updateService(inputTask, taskId!)
    }

    if (onClickMenu) onClickMenu(value)
    //console.log('Priority :' + localStorage.getItem('priority'))
  }

  async function getStatusValue(value: string) {
    let confirmTriggered = false
    const _id = _status.filter(
      (element) =>
        element.CategoryId == +value &&
        element.Type.toLowerCase() === STATUS.toLowerCase(),
    )[0]._id

    const inputTask: InputTasks = {
      StatusCategory: _id,
    }

    if (parentTask) {
      if (
        (parentTask.StatusCategory as StatusCategory).CategoryId == 3 ||
        (parentTask.StatusCategory as StatusCategory).CategoryId == 4
      ) {
        confirmTriggered = true
        showComletedConfirmSubtask(false)
        //return
      } else {
        confirmTriggered = false
        //return
      }
    }

    if (+value == 9 || +value == 10) {
      setNewStatus(_id.toString())
      setRejectModal(true)
      setTaskValue(task)
    } else {
      if (+value == 2) {
        inputTask.DoneDate = new Date()

        if (task) {
          const response = await GetTasksById(
            '',
            task._id!,
            getCookie('user_id')!,
          )
          const subTasks: Tasks[] = response[0].Subtask
            ? response[0].Subtask
            : []
          if (subTasks && subTasks.length > 0) {
            const inProgressSubTask = subTasks.filter(
              (element) =>
                (element.StatusCategory as StatusCategory).CategoryId == 1 ||
                (element.StatusCategory as StatusCategory).CategoryId == 2,
            )
            if (inProgressSubTask.length > 0) {
              setOpenWarning(true)
              setTaskValue(response[0])
              confirmTriggered = true
            }
          }
        }
      } else if (+value == 3 || +value == 4) {
        inputTask.CloseDate = new Date()

        if (task) {
          const response = await GetTasksById(
            '',
            task._id!,
            getCookie('user_id')!,
          )
          const subTasks: Tasks[] = response[0].Subtask
            ? response[0].Subtask
            : []
          if (subTasks && subTasks.length > 0) {
            const inProgressSubTask = subTasks.filter(
              (element) =>
                (element.StatusCategory as StatusCategory).CategoryId == 1 ||
                (element.StatusCategory as StatusCategory).CategoryId == 2,
            )
            if (inProgressSubTask.length > 0) {
              setOpenWarning(true)
              setTaskValue(response[0])
              confirmTriggered = true
            }
          }
        }
      }
      if (!confirmTriggered) {
        const showHide: ScoreCompProp = GetReviewAndScoreDisplay(
          getCookie('user_id')?.toString()!,
          task?.Assignee[0]._id!,
          task?.Reporter._id!,
          (task?.StatusCategory as StatusCategory).CategoryId.toString(),
          value,
          task?.Score,
        )

        setDefaultScore(showHide.score)
        setScore(true)

        if (showHide.showSCore !== HIDE) {
          console.log('Alright hans,time to go')
          setNewStatus(_id.toString())
          setReadOnly(false)
          setMiniModal(true)
        } else {
          console.log('But he ate my last meal')
          setReadOnly(true)
          setMiniModal(false)
          if (mode === undefined || mode === UPDATE_MODE) {
            updateService(inputTask, taskId!, value)
          }
          if (onClickMenu) {
            onClickMenu(value)
          }
        }
        setTxt(value)
      }
    }
  }

  return (
    <>
      {items && items.length > 0 ? (
        <Space direction="horizontal">
          {/* <h1 style={color}></h1> */}
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            //onOpenChange={(e) => console.log}
            disabled={disableComp}
          >
            <a onClick={(e) => e.preventDefault()}>
              {loading === false ? (
                <Space>
                  {button === true ? (
                    <Button shape="circle">
                      <FindIcon type={itemType} text={txt} />
                    </Button>
                  ) : (
                    <FindIcon type={itemType} text={txt} />
                  )}
                </Space>
              ) : (
                <Space>
                  <Spin size="small" />
                </Space>
              )}
            </a>
          </Dropdown>
        </Space>
      ) : (
        <Dropdown
          menu={{
            items: [],
          }}
          //onOpenChange={(e) => console.log}
          disabled={true}
        >
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              cursor: 'not-allowed',
            }}
          >
            {loading === false ? (
              <Space>
                {button === true ? (
                  <Button shape="circle" style={{ cursor: 'not-allowed' }}>
                    <FindIcon type={itemType} text={txt} />
                  </Button>
                ) : (
                  <FindIcon type={itemType} text={txt} />
                )}
              </Space>
            ) : (
              <Space>
                <Spin size="small" />
              </Space>
            )}
          </a>
        </Dropdown>
      )}
      {task && score && (
        <ScoreComp
          task={task}
          readOnly={readOnly}
          openModal={miniModal}
          closeFunc={OnCloseFunc}
          updateFunc={onClickMenu}
          newStatus={newStatus}
          defaultScore={defaultScore}
        />
      )}
      {taskValue && (
        <RejectModal
          title={'Bạn có chắc chắn muốn hủy công việc này?'}
          task={taskValue}
          openModal={rejectModal}
          closeFunc={OnCloseReject}
          newStatus={newStatus}
        />
      )}
      {taskValue && (
        <TaskWarningModal
          openModal={openWarning}
          task={taskValue}
          handleOk={() => setOpenWarning(false)}
          handleCancel={() => setOpenWarning(false)}
          closeFunc={() => setOpenWarning(false)}
        />
      )}
    </>
  )
}

export default DropdownProps
