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
  ASSIGNEE,
  IGNORE_STT_DEFAULT,
  IGNORE_STT_DEFAULT_TASK_DETAIL,
  PRIORITY,
  REPORTER,
  UPDATE_MODE,
} from '../util/ConfigText'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/services/tasksService'
import '../assets/css/index.css'
import { Status } from '../data/interface/Status'
import GetStatusIgnoreList from '../util/StatusList'
import { getCookie } from 'typescript-cookie'
import { GetUserByType } from '../data/services/allUsersService'
import { GetUsersByProject } from '../data/services/projectService'
import { useAppSelector } from '../redux/app/hook'
import { PriorityCategory, StatusCategory } from '../data/database/Categories'
import { _private } from 'workbox-core'

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
  parentTask?: Tasks
  disabled?: boolean
}

const errorBorder: React.CSSProperties = {
  borderColor: 'red',
  width: '100%',
}

const normalBorder: React.CSSProperties = {
  borderColor: 'transparent',
  width: '100%',
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
  disabled,
}) => {
  //const taskKey = 'Subtask'
  const [inputStyle, setInputStyle] =
    useState<React.CSSProperties>(normalBorder)
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
  const [dataLoaded, setDataLoaded] = useState(false)
  const [disabledSubtask, setDisabledSubtask] = useState(
    disabled ? disabled : false,
  )
  const statusList = JSON.parse(
    localStorage.getItem('statusData')!,
  ) as StatusCategory[]
  const priorityList = JSON.parse(
    localStorage.getItem('priorityData')!,
  ) as PriorityCategory[]

  useEffect(() => {
    setDisabledSubtask(disabled ? disabled : false)
  }, [disabled])

  const fetchData = useCallback(async () => {
    /* if (subTask.Assignee.length > 0) {
      if (getCookie('user_id') === subTask.Assignee[0]._id) {
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    } */
    if (noLoad !== true) {
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
    setDataLoaded(true)
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
        (tasks.StatusCategory as StatusCategory).CategoryId.toString(),
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
    const filterPriorityId = priorityList.filter(
      (element) => element.CategoryId == e,
    )
    if (filterPriorityId.length) {
      console.log('Bur')
      setSubTask({ ...subTask, PriorityCategory: [filterPriorityId[0]._id] })
      setHideSubmitBtn(false)

      form.setFieldsValue({ PriorityCategory: [filterPriorityId[0]._id] })
    }
    //console.log('Key ' + e)
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
    //console.log('Key assignee' + e.key)
  }

  const handleMenuClickReporter: MenuProps['onClick'] = (e) => {
    setHideSubmitBtn(false)
    const _reporter: Users = {
      _id: e.key,
    }
    setSubTask({ ...subTask, Reporter: _reporter })

    form.setFieldsValue({ Reporter: { _id: e.key } })
    //console.log('Key reporter' + e.key)
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
            disabled={disabledSubtask}
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              remember: true,
              Layout: 'vertical',
              ['TaskName']: subTask.TaskName,
            }}
            onFinish={(e) => {
              if (onFinish) onFinish(e)
              setShowEditDetail(true)
              setStatusIgnoreList(IGNORE_STT_DEFAULT_TASK_DETAIL())
            }}
            onFinishFailed={(e: any) => {
              //setEditTaskName(true)
              setInputStyle(errorBorder)
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
                style={{
                  marginBottom: '0px',
                }}
              >
                {(tasks.created !== false && showEditDetail) === true && (
                  <DropdownProps
                    type="Status"
                    text={
                      tasks.StatusCategory
                        ? (
                            tasks.StatusCategory as StatusCategory
                          ).CategoryId!.toString()
                        : '1'
                    }
                    //button={true}
                    taskId={taskId}
                    id={'details'}
                    ignoreStt={statusIgnoreList}
                    mode={mode}
                    task={tasks}
                    parentTask={parentTask}
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
                    showCount
                    name="TaskName"
                    maxLength={100}
                    style={inputStyle}
                    autoFocus={autoFocus}
                    //defaultValue={subTask.TaskName}
                    //value={subTask.TaskName}
                    onChange={(e) => {
                      form.setFieldsValue({ TaskName: e.target.value })
                      if (e.target.value.trim() !== '') {
                        setInputStyle(normalBorder)
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
                      form.setFieldsValue({ TaskName: subTask.TaskName })
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
                ) : disabled ? (
                  <p>{form.getFieldValue('TaskName')}</p>
                ) : (
                  <p className="456" onClick={() => setEditTaskName(true)}>
                    {form.getFieldValue('TaskName')}
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
                {dataLoaded && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <UserListComp
                      disabled={disabledSubtask}
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
                      tooltipText="Assignee"
                      onClickMenu={handleMenuClickAssignee}
                      mode={mode}
                      inputUserData={subTask.Assignee}
                      assigneeUpdate={true}
                      taskId={taskId}
                    />
                  </Suspense>
                )}
              </Form.Item>
              <Form.Item
                //label="Username"
                name="Reporter"
                style={{
                  marginBottom: '0px',
                }}
              >
                {dataLoaded && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <UserListComp
                      disabled={disabledSubtask}
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
                      tooltipText="Reporter"
                      onClickMenu={handleMenuClickReporter}
                      mode={mode}
                      inputUserData={reporters}
                      taskId={taskId}
                    />
                  </Suspense>
                )}
              </Form.Item>
              <Form.Item
                //label="Username"
                name="PriorityCategory"
                style={{
                  marginBottom: '0px',
                }}
              >
                <DropdownProps
                  disabled={disabledSubtask}
                  type={'Priority'}
                  text={
                    tasks.PriorityCategory
                      ? (
                          tasks.PriorityCategory as PriorityCategory
                        ).CategoryId.toString()
                      : '6'
                  }
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
                rules={[{ required: true, message: '' }]}
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
                  isSubtask={true}
                  task={tasks}
                />
              </Form.Item>

              {hideSubmitBtn === false && (
                <Button
                  type="primary"
                  //htmlType="submit"
                  onClick={buttonOnClick}
                >
                  Save
                </Button>
              )}
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
