import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Avatar, Button, Form, Input, MenuProps, Space, Spin } from 'antd'
import DropdownProps from './Dropdown'
import { Tasks } from '../data/database/Tasks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faSave,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import { Users } from '../data/database/Users'

import type { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { CustomRoutes } from '../customRoutes'
import {
  IGNORE_STT_DEFAULT,
  IGNORE_STT_DEFAULT_TASK_DETAIL,
  UPDATE_MODE,
} from '../util/ConfigText'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/tasksService'
import '../assets/css/index.css'
import { Status } from '../data/interface/Status'
import GetStatusIgnoreList from '../util/StatusList'
import { getCookie } from 'typescript-cookie'
import { GetUserByType } from '../data/allUsersService'
import { GetUsersByProject } from '../data/projectService'

const UserListComp = React.lazy(() => import('./UserListComp'))
type SubTaskInput = {
  // style: {{with : '20px'}}
  tasks: Tasks
  onFinish?: (e: any) => void
  onFinishFailed: (error: any) => void
  assigneeData: Users[]
  reporterData: Users[]
  noLoad?: boolean
  mode?: string
  taskId?: string
  isEditDetail?: boolean
  parentTask?: string
}

const items: MenuProps['items'] = []

const SubTask: React.FC<SubTaskInput> = ({
  tasks,
  onFinish,
  onFinishFailed,
  mode,
  taskId,
  parentTask,
  noLoad,
  assigneeData,
  reporterData,
}) => {
  //const taskKey = 'Subtask'
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [subTask, setSubTask] = useState<Tasks>(tasks)
  const [editTaskName, setEditTaskName] = useState(true)
  const [hideSubmitBtn, setHideSubmitBtn] = useState(false)
  const [autoFocus, setAutoFocus] = useState(true)
  const [showEditDetail, setShowEditDetail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)
  const [statusIgnoreList, setStatusIgnoreList] = useState<Status[]>([])
  const [assigneeDataInner, setAssigneeDataInner] = useState<Users[]>([])
  const [reporterDataInner, setReporterDataInner] = useState<Users[]>([])

  const fetchData = useCallback(async () => {
    if (noLoad !== true) {
      console.log('Goes here ' + getCookie('projectId'))
      if (!getCookie('projectId')) {
        //no project
        const data = await GetUserByType(
          'api/users/getReporterOrAssignee',
          'assignee',
          getCookie('user_id')?.toString(),
        )
        setAssigneeDataInner(data)

        const dataRp = await GetUserByType(
          'api/users/getReporterOrAssignee',
          'reporter',
          getCookie('user_id')?.toString(),
        )
        setReporterDataInner(dataRp)
      } else {
        //have project
        const dataAssignee = await GetUsersByProject(
          getCookie('projectId')!,
          'assignee',
        )
        const data = dataAssignee.data as Users[]

        setAssigneeDataInner(data)

        const dataReporter = await GetUsersByProject(
          getCookie('projectId')!,
          'reporter',
        )

        const dataRp = dataReporter.data as Users[]
        setReporterDataInner(dataRp)
      }
    } else {
      setAssigneeDataInner(assigneeData)
      setReporterDataInner(reporterData)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (tasks.TaskName !== '') {
      setHideSubmitBtn(true)
      setEditTaskName(false)
      setShowEditDetail(true)
      const ignoreList: Status[] = GetStatusIgnoreList(
        getCookie('user_id')?.toString()!,
        tasks.Assignee[0]._id!,
        tasks.Reporter._id!,
        tasks.Status,
      )

      setStatusIgnoreList(ignoreList)
      //if (mode !== UPDATE_MODE) {
      form.setFieldsValue({ TaskName: tasks.TaskName })
      //}
    } else {
      setHideSubmitBtn(false)
      setEditTaskName(true)
      setShowEditDetail(false)
    }
  }, [])

  const OnNavigate = (taskId: string) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskId, {
      state: {
        search: '/' + taskId, // query string
        // location state
        //parentTask: parentTask,
      },
    })
    navigate(0)
  }

  const onOkEvent = async (date: null | (Dayjs | null)) => {
    setHideSubmitBtn(false)
    if (date !== null) {
      setSubTask({ ...subTask, DueDate: new Date(date.toString()) })
      form.setFieldsValue({ DueDate: new Date(date.toString()) })
    }
    //Save DateTime here
    if (mode === undefined || mode === UPDATE_MODE) {
      const dateStr = date?.toString()
      const inputTask: InputTasks = {
        DueDate: new Date(dateStr ? dateStr : ''),
      }

      await UpdateTask('/api/task/', taskId!, inputTask)
    }
  }

  const handleMenuClick = (e: any) => {
    setSubTask({ ...subTask, Priority: e })
    setHideSubmitBtn(false)

    form.setFieldsValue({ Priority: e })
    console.log('Key ' + e)
    //save priority
  }

  const handleMenuClickAssignee: MenuProps['onClick'] = (e) => {
    setHideSubmitBtn(false)
    const _assignee: Users = {
      _id: e.key,
    }
    const _assigneeList: Users[] = [_assignee]
    setSubTask({ ...subTask, Assignee: _assigneeList })

    form.setFieldsValue({ Assignee: [{ _id: e.key }] })
    console.log('Key assignee' + e.key)
  }

  const handleMenuClickReporter: MenuProps['onClick'] = (e) => {
    setHideSubmitBtn(false)
    const _reporter: Users = {
      _id: e.key,
    }
    setSubTask({ ...subTask, Reporter: _reporter })

    form.setFieldsValue({ Reporter: { _id: e.key } })
    console.log('Key reporter' + e.key)
  }

  const onBlurTaskName = async () => {
    //save to task

    const inputTasks: InputTasks = {
      TaskName: subTask.TaskName,
    }

    await UpdateTask('/api/task/', taskId!, inputTasks)
  }

  const buttonOnClick = () => {
    form.submit()
    setHideSubmitBtn(true)

    //setSubTaskDetail(true)
  }

  const reporters: Users[] = []
  if (tasks.Reporter._id !== undefined) {
    reporters.push(tasks.Reporter)
  }

  return (
    <>
      {loading === false ? (
        <div
          //direction="horizontal"
          style={{
            border: 'solid',
            borderWidth: '1px',
            borderColor: '#d9d9d9',
            paddingRight: '10px',
            // paddingLeft : '10px',
            // width: '100%',
          }}
          //align="baseline"
        >
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true, Layout: 'vertical' }}
            onFinish={(e) => {
              if (onFinish) onFinish(e)
              setShowEditDetail(true)
              setStatusIgnoreList(IGNORE_STT_DEFAULT_TASK_DETAIL())
            }}
            onFinishFailed={(e: any) => {
              //setEditTaskName(true)
              setHideSubmitBtn(false)
              onFinishFailed(e)
            }}
            autoComplete="off"
          >
            <Space
              direction="horizontal"
              align="center"
              style={{ width: '100%' }}
            >
              <Form.Item name="_id"></Form.Item>
              <Form.Item
                name="Status"
                style={{
                  marginBottom: '0px',
                }}
              >
                {(tasks.created !== false && showEditDetail) === true && (
                  <DropdownProps
                    type="Status"
                    text={tasks.Status ? tasks.Status : ''}
                    //button={true}
                    taskId={taskId}
                    id={'details'}
                    ignoreStt={statusIgnoreList}
                    mode={mode}
                    task={tasks}
                  />
                )}
              </Form.Item>
              <Form.Item
                name="TaskName"
                rules={[
                  { required: true, message: '' },
                  {
                    validator: (_, value) =>
                      value && value.trim() !== ''
                        ? Promise.resolve()
                        : Promise.reject(new Error('')),
                  },
                ]}
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.additional !== curValues.additional
                }
                style={{
                  width: '20vw',
                  marginBottom: '0px',
                }}
              >
                {editTaskName === true ? (
                  <Input
                    style={{ borderColor: 'transparent', width: '100%' }}
                    autoFocus={autoFocus}
                    defaultValue={subTask.TaskName}
                    value={subTask.TaskName}
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        setHideSubmitBtn(false)
                        setSubTask({
                          ...subTask,
                          TaskName: e.target.value,
                        })
                      } else {
                        setHideSubmitBtn(false)
                        setSubTask({
                          ...subTask,
                          TaskName: subTask.TaskName,
                        })
                      }
                    }}
                    onBlur={() => {
                      if (subTask.TaskName.trim() !== '') {
                        setEditTaskName(false)
                        setSubTask({
                          ...subTask,
                          _id: taskId,
                        })
                        form.setFieldsValue({ _id: taskId })
                        //console.log('Subtask ' + subTask.created)

                        if (subTask.created !== false) onBlurTaskName()
                      }
                    }}
                    placeholder="Task name"
                  />
                ) : (
                  <p onClick={() => setEditTaskName(true)}>
                    {subTask.TaskName}
                  </p>
                )}
              </Form.Item>
              {tasks.created !== false && showEditDetail === true && (
                <FontAwesomeIcon
                  className="edit-icon"
                  icon={faEdit}
                  onClick={() => OnNavigate(taskId!)}
                  style={{
                    marginBottom: '0px',
                  }}
                />
              )}
              <Form.Item
                //label="Username"
                name="Assignee"
                style={{
                  marginBottom: '0px',
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <UserListComp
                    userData={assigneeDataInner}
                    maxCount={2}
                    icon={
                      <Avatar
                        style={{
                          borderColor: '#9CA3AF',
                          backgroundColor: 'white',
                        }}
                      >
                        <FontAwesomeIcon icon={faUserPlus} color="#000000" />
                      </Avatar>
                    }
                    onClickMenu={handleMenuClickAssignee}
                    mode={mode}
                    inputUserData={subTask.Assignee}
                    assigneeUpdate={true}
                    taskId={taskId}
                  />
                </Suspense>
              </Form.Item>
              <Form.Item
                //label="Username"
                name="Reporter"
                style={{
                  marginBottom: '0px',
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <UserListComp
                    userData={reporterDataInner}
                    maxCount={3}
                    icon={
                      <Avatar
                        style={{
                          borderColor: '#9CA3AF',
                          backgroundColor: 'white',
                        }}
                      >
                        <FontAwesomeIcon icon={faUserCheck} color="#000000" />
                      </Avatar>
                    }
                    onClickMenu={handleMenuClickReporter}
                    mode={mode}
                    inputUserData={reporters}
                    taskId={taskId}
                  />
                </Suspense>
              </Form.Item>
              <Form.Item
                //label="Username"
                name="Priority"
                style={{
                  marginBottom: '0px',
                }}
              >
                <DropdownProps
                  type={'Priority'}
                  text={tasks.Priority ? tasks.Priority : ''}
                  id={'SubTask'}
                  onClickMenu={handleMenuClick}
                  mode={mode}
                  taskId={taskId}
                  task={tasks}
                />
              </Form.Item>
              <Form.Item
                //label="Username"
                name="DueDate"
                style={{
                  marginBottom: '0px',
                }}
              >
                <CustomDatePicker
                  dueDateInput={
                    subTask.DueDate ? subTask.DueDate.toString() : ''
                  }
                  //onChangeValue={OnChangeDateTime}
                  mode={mode}
                  onOkEvent={onOkEvent}
                />
              </Form.Item>
              <Form.Item
                //label="Username"
                name="ButtonSubmit"
                style={{
                  marginBottom: '0px',
                }}
              >
                {hideSubmitBtn === false && (
                  <Button
                    type="primary"
                    //htmlType="submit"
                    onClick={buttonOnClick}
                  >
                    Save
                  </Button>
                )}
              </Form.Item>
            </Space>
          </Form>
          {errorMsg === true ? <h2>Error</h2> : null}
        </div>
      ) : (
        <Spin />
      )}
    </>
  )
}

export default SubTask
