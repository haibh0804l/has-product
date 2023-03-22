import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  Col,
  Layout,
  Row,
  Space,
  Upload,
  message,
  Avatar,
  Input,
  notification,
  Spin,
  Button,
  MenuProps,
  Tabs,
  TabsProps,
  UploadFile,
} from 'antd'
import Breadcrumbs from '../components/Breadcrumbs'
import '../assets/css/layout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropdownProps from '../components/Dropdown'
import UserListComp from '../components/UserListComp'
import { UploadProps, Modal } from 'antd'
import { Tasks } from '../data/database/Tasks'
import { Users } from '../data/database/Users'
import type { Dayjs } from 'dayjs'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  faPlus,
  faStar,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { CustomRoutes } from '../customRoutes'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { GetTasksById, InsertTask, UpdateTask } from '../data/tasksService'
import { InputTasks } from '../data/database/InputTasks'
import _ from 'lodash'
import {
  DEFAULT_STT,
  HIDE,
  READONLY,
  SHOW,
  UPDATE_FAIL,
  UPDATE_MODE,
} from '../util/ConfigText'
import CustomFloatButton from '../components/QuickCreate'
import { GetUserByType } from '../data/allUsersService'
import { getCookie } from 'typescript-cookie'
import CustomDatePicker from '../components/CustomDatePicker'
import { SubTaskCompProp, SubTaskProp } from '../data/interface/SubTaskProp'
import ObjectID from 'bson-objectid'
import SubTask from '../components/SubTasks'
import ScoreComp from '../components/ScoreComponent'
import { ScoreCompProp } from '../data/interface/ScoreCompProps'
import GetScoreReviewDisplay from '../util/ScoreReview'
import { Status } from '../data/interface/Status'
import GetStatusIgnoreList from '../util/StatusList'
import HistoryComponent from '../components/History'
import Comments from '../components/Comments'
import { useAppDispatch } from '../redux/app/hook'
import { fetchHistory } from '../redux/features/history/historySlice'
import { AttachmentResponse } from '../data/database/Attachment'
import axios from 'axios'
import { RemoveAttachment } from '../data/attachmentService'
import { CheckExtension } from '../util/Extension'
import io from 'socket.io-client'
import { SocketContext } from '../context'

interface TaskData {
  taskData?: Tasks
  openModal: boolean
}

const socket = io(process.env.REACT_APP_SOCKET!, {
  reconnectionDelayMax: 10000,
  /* auth: {
    token: '123',
  },
  query: {
    'my-key': 'my-value',
  }, */
})

const { Header, Content } = Layout

const { Dragger } = Upload

const ModalBreadCrumb = () => {
  return <Breadcrumbs main={'Home'} sub={CustomRoutes.TaskDetails.name} />
}

function getUnique(array: any[], key: any) {
  if (typeof key !== 'function') {
    const property = key
    key = function (item: any) {
      return item[property]
    }
  }
  return Array.from(
    array
      .reduce(function (map, item) {
        const k = key(item)
        if (!map.has(k)) map.set(k, item)
        return map
      }, new Map())
      .values(),
  )
}

const TaskDetails: React.FC<TaskData> = ({ openModal }) => {
  const taskId = useParams()
  const navigate = useNavigate()

  const location = useLocation()
  const parentTask = location.state.parentTask
  //const taskData = location.state.taskData as Tasks // Read values passed on state
  let assignee: Users[] = []
  const [loading, setLoading] = useState(true)
  const [editorValue, setEditorValue] = useState('')
  const [taskData, setTaskData] = useState<Tasks>({
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    DueDate: new Date(),
    Assignee: assignee,
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: {},
    GroupPath: '',
  })

  const [haveParentTask, setHaveParentTask] = useState(false)
  const [open, setOpen] = useState(openModal)
  const [editTaskName, setEditTaskName] = useState(false)
  const [assigneeData, setAssigneeData] = useState<Users[]>([])
  const [reporterData, setReporterData] = useState<Users[]>([])
  const [getUsers, setGetUsers] = useState(false)
  const [saveBtn, setSaveBtn] = useState(false)
  const subTask: Tasks[] = []
  const [subTasksComp, setSubTaskComp] = useState<SubTaskCompProp[]>([])
  const [subTaskIdList, setSubTaskIdList] = useState<string[]>([])
  const [openSubTaskBtn, setOpenSubTaskBtn] = useState(true)
  const _assignUser: Users[] = []
  const [myTask, setMyTask] = useState<Tasks>({
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    Assignee: _assignUser,
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: 'In progress',
    Reporter: {},
    GroupPath: '',
  })

  const [miniModal, setMiniModal] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const [showScore, setShowScore] = useState(false)
  const [statusIgnoreList, setStatusIgnoreList] = useState<Status[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [attachmentIdList, setAttachmentIdList] = useState<string[]>([])
  const socket = useContext(SocketContext)
  const [isConnected, setIsConnected] = useState(socket.connected)
  const dispatch = useAppDispatch()
  const [saved, setSaved] = useState(false)

  const customRequest = (options: any) => {
    const data = new FormData()
    const fileType = options.file.name.substring(
      options.file.name.lastIndexOf('.') + 1,
      options.file.name.length,
    )

    const fileName = options.file.name.substring(
      0,
      options.file.name.lastIndexOf('.'),
    )
    data.append('userId', getCookie('user_id')!)
    data.append('userName', getCookie('user_name')!)
    data.append('taskId', taskId.id!.toString())
    data.append('fileName', fileName)
    data.append('fileType', fileType)
    data.append('description', options.file.name)
    data.append('file', options.file)
    const config = {
      headers: {
        'content-type':
          'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
      },
    }
    axios
      .post(options.action, data, config)
      .then((res: any) => {
        return res.data
      })
      .then((res: AttachmentResponse[]) => {
        if (res[0]._id && res[0]._id !== null) {
          setFileList([
            ...fileList,
            {
              uid: res[0]._id,
              name: options.file.name,
              url:
                process.env.REACT_APP_API_ATTACHMENTS_GETATTACHMENT +
                res[0]._id,
            },
          ])

          setAttachmentIdList([...attachmentIdList, res[0]._id])

          message.success(`${options.file.name} file uploaded successfully.`)
          //options.onSuccess(res, options.file)
        } else {
          message.error(`${options.file.name} file upload failed.`)
          return Upload.LIST_IGNORE
        }
      })
      .catch((err: Error) => {
        message.error(`${options.file.name} file upload failed.`)
        return Upload.LIST_IGNORE
        //
      })
  }

  const props: UploadProps = {
    fileList: fileList,
    multiple: false,
    action: process.env.REACT_APP_API_ATTACHMENTS_ADDATTACHMENT!,
    customRequest: customRequest,
    beforeUpload(e) {
      const fileType = e.name.substring(
        e.name.lastIndexOf('.') + 1,
        e.name.length,
      )

      if (!CheckExtension(fileType)) {
        message.error('File type not allowed')
        return Upload.LIST_IGNORE
      }

      if (e.size > 5242880) {
        message.error('File size cannot exceed 5MB')
        return Upload.LIST_IGNORE
      }
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    async onRemove(e) {
      const response = await RemoveAttachment(e.uid, taskData._id!)
      if (response.ErrorMessage) {
        message.error('Remove failed with error ' + response.ErrorMessage)
        return false
      } else {
        setFileList(fileList.filter((element) => element.uid !== e.uid))
        setAttachmentIdList(
          attachmentIdList.filter((element) => element !== e.uid),
        )
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const items: TabsProps['items'] = [
    {
      key: 'comments',
      label: `Comments`,
      children: <Comments taskId={taskData._id!} />,
    },
    {
      key: 'history',
      label: `History`,
      children: (
        <HistoryComponent
          collection={'Tasks'}
          //documentId={'63b65aa9f1e6797000d19497'}
          documentId={taskData._id!}
        />
      ),
    },
  ]

  const OnChange = (key: string) => {
    if (key === 'history') {
      const params = {
        collection: 'Tasks',
        //documentId: taskData._id!,
        documentId: taskData._id,
      }
      dispatch(fetchHistory(params))
    }
  }

  const OnCloseFunc = () => {
    setMiniModal(false)
    fetchData()
    setGetUsers(false)
  }

  const BackToMainTask = (taskId: string) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskId, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
        //parentTask: parentTask,
      },
    })
    navigate(0)
  }

  const onChangeStatus: MenuProps['onClick'] = (e) => {
    fetchData()
    setGetUsers(false)
  }

  const fetchData = useCallback(async () => {
    if (parentTask) setHaveParentTask(true)
    setGetUsers(true)

    const data = await GetTasksById(
      '/api/task/getonetask/',
      taskId.id as string,
    )
    setTaskData(data[0])
    if (
      data[0].Status.toLowerCase() === 'Completed'.toLowerCase() ||
      data[0].Status.toLowerCase() === 'Incompleted'.toLowerCase()
    ) {
      setReadOnly(false)
    }

    //attachment
    let attachments: UploadFile[] = []
    data[0].Attachment.map((element: AttachmentResponse) => {
      attachments.push({
        uid: element._id,
        name: element.FileName + '.' + element.FileType,
        url: process.env.REACT_APP_API_ATTACHMENTS_GETATTACHMENT + element._id,
      })
    })
    setFileList(attachments)
    setAttachmentIdList(data[0].Attachment)

    let desc = ''
    try {
      desc = JSON.parse(data[0].Description)
    } catch (e) {}
    setEditorValue(desc)

    const dataAssignee = await GetUserByType(
      '/api/users/getReporterOrAssignee',
      'assignee',
      getCookie('user_id')?.toString(),
    )

    setAssigneeData(dataAssignee)

    const dataRp = await GetUserByType(
      '/api/users/getReporterOrAssignee',
      'reporter',
      getCookie('user_id')?.toString(),
    )
    setReporterData(dataRp)

    //console.log('All data ' + JSON.stringify(data[0].Subtask!))
    const scoreProp: ScoreCompProp = GetScoreReviewDisplay(
      getCookie('user_id')?.toString()!,
      data[0].Assignee[0]._id!,
      data[0].Reporter._id!,
      data[0].Status,
    )

    if (scoreProp.showSCore === HIDE) {
      setShowScore(false)
    } else if (scoreProp.showSCore === READONLY) {
      setShowScore(true)
      setReadOnly(true)
    } else if (scoreProp.showSCore === SHOW) {
      setShowScore(true)
      setReadOnly(false)
    }

    const ignoreList: Status[] = GetStatusIgnoreList(
      getCookie('user_id')?.toString()!,
      data[0].Assignee[0]._id!,
      data[0].Reporter._id!,
      data[0].Status,
    )

    setStatusIgnoreList(ignoreList)

    setLoading(false)
  }, [])

  useEffect(() => {
    const _taskData: Tasks = { ...taskData }
    let _subTaskComp: SubTaskCompProp[] = []
    if (assigneeData.length > 0 && reporterData.length > 0) {
      if (subTasksComp.length === 0) {
        for (let index = 0; index < _taskData.Subtask!.length; index++) {
          _taskData.Subtask![index].created = true
          _subTaskComp.push({
            id: _taskData.Subtask![index]._id,
            content: (
              <SubTaskCom
                key={_subTaskComp.length}
                index={_subTaskComp.length}
                subTaskId={_taskData.Subtask![index]._id}
                task={_taskData.Subtask![index]}
                parentTask={_taskData._id}
              />
            ),
          })
        }
      }
    }

    setSubTaskComp(subTasksComp.concat(getUnique(_subTaskComp, 'id') as any[]))
  }, [assigneeData, reporterData])

  useEffect(() => {
    subTasksComp.length = 0
    fetchData()

    setGetUsers(false)
  }, [fetchData])

  useEffect(() => {
    socket.on('connection', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    /* socket.on('addCommentData', () => {
      subTasksComp.length = 0
      fetchData()

      setGetUsers(false)
    }) */

    return () => {
      socket.off('connection')
      socket.off('disconnect')
      /* socket.off('addCommentData') */
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const inputTask: InputTasks = {
        Description: JSON.stringify(editorValue),
      }
      if (taskData._id) {
        UpdateTask('/api/task/', taskData._id!, inputTask).then((r) => {})
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [saved])

  const SaveEditor = async () => {
    setSaveBtn(false)
    const inputTask: InputTasks = {
      Description: JSON.stringify(editorValue),
    }
    await UpdateTask('/api/task/', taskData._id!, inputTask)
  }

  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    //setEditorValue(parse(editor.getHTML()) as string)
    setEditorValue(editor.getContents())
    setSaved(!saved)
  }

  const onOkEvent = async (date: null | (Dayjs | null)) => {
    const dateStr = date?.toString()
    setTaskData({ ...taskData, DueDate: new Date(dateStr ? dateStr : '') })
    //Save DateTime here
    const inputTask: InputTasks = {
      DueDate: new Date(dateStr ? dateStr : ''),
    }

    await UpdateTask('/api/task/', taskData._id!, inputTask).catch((error) => {
      setLoading(false)
      notification.open({
        message: 'Notification',
        description: UPDATE_FAIL,
        duration: 2,
        onClick: () => {},
      })
    })
  }

  const OnBlurTaskName = async (e: any) => {
    setEditTaskName(false)
    if (e.target.value !== '') {
      const inputTask: InputTasks = {
        TaskName: e.target.value,
      }

      setTaskData({ ...taskData, TaskName: e.target.value })
      //update task
      await UpdateTask('/api/task/', taskData._id!, inputTask)
        .then((r) => {
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          notification.open({
            message: 'Notification',
            description: UPDATE_FAIL,
            duration: 2,
            onClick: () => {},
          })
        })
    } else {
      setTaskData({ ...taskData, TaskName: taskData.TaskName })
    }
  }

  const showModal = () => {
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
    navigate(CustomRoutes.MyWork.path, {
      state: {
        refresh: true,
      },
    })
    //navigate(0)
  }

  let reporter: Users[] = []
  reporter.push(taskData.Reporter)

  const SubTaskCom: React.FC<SubTaskProp> = ({
    index,
    subTaskId,
    task,
    parentTask,
  }) => {
    const onFinish = async (values: any) => {
      //console.log('Success ' + JSON.stringify(values))
      const _task: Tasks = JSON.parse(JSON.stringify(values))
      _task.Status = DEFAULT_STT
      _task.CreateDate = new Date()
      _task.StartDate = new Date()
      if (_task.DueDate === undefined) {
        _task.DueDate = new Date('')
      }

      if (_task.Reporter === undefined) {
        const user: Users = {
          _id: getCookie('user_id')?.toString(),
        }
        _task.Reporter = user
      }

      if (_task.Assignee === undefined || _task.Assignee.length === 0) {
        const user: Users = {
          _id: getCookie('user_id')?.toString(),
        }
        _task.Assignee = [user]
      }

      if (_task.Priority === undefined) {
        _task.Priority = 'Medium'
      }

      //subTask.push(_task)
      const subTaskFilter = subTask.filter((e) => e._id === _task._id)
      if (subTaskFilter.length === 0) {
        //insert

        subTask.push(_task)
      } else {
        //update
        for (let indexS = 0; indexS < subTask.length; indexS++) {
          if (subTask[indexS]._id === _task._id) {
            subTask[indexS] = _task
            break
          }
        }
      }

      //setMyTask({ ...myTask, Subtask: subTask })
      setOpenSubTaskBtn(true)

      //insert Subtask here,make a shallow copy
      const mainTask: Tasks = { ...taskData }

      const subTaskIdList: string[] = []
      subTaskIdList.push(_task._id!)
      mainTask.Subtask = subTaskIdList

      //get parent to first
      let inputTasks: Tasks[] = []
      inputTasks.push(_task)
      inputTasks.unshift(mainTask)

      const realInputTask: InputTasks = {
        userId: getCookie('user_id'),
        userName: getCookie('user_name'),
        tasks: inputTasks,
      }

      await InsertTask('', realInputTask)
    }

    const onFinishFailed = (values: any) => {
      console.log('Failed ' + JSON.stringify(values))
    }

    return (
      <SubTask
        key={subTaskId}
        tasks={task!}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        assigneeData={assigneeData}
        reporterData={reporterData}
        mode={UPDATE_MODE}
        taskId={subTaskId}
        isEditDetail={true}
        parentTask={parentTask}
      />
    )
  }

  const AddTask = () => {
    const subId = ObjectID(new Date().getTime()).toHexString()
    setSubTaskIdList([...subTaskIdList, subId])
    setSubTaskComp(
      subTasksComp.concat({
        id: subId,
        content: (
          <SubTaskCom
            key={subTasksComp.length}
            index={subTasksComp.length}
            subTaskId={subId}
            task={myTask}
            parentTask={taskData._id}
          />
        ),
      }),
    )
    setOpenSubTaskBtn(false)
  }

  const OnCloseModal = (e: any) => {
    setMiniModal(false)
  }

  return (
    <>
      <Modal
        //title="Basic Modal"
        open={open}
        //onOk={this.handleOk}
        onCancel={hideModal}
        width="92%"
        keyboard={false}
        footer={[]}
      >
        {loading === false ? (
          <Layout>
            <Header style={{ height: '20%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <ModalBreadCrumb />
                {haveParentTask === true && (
                  <Button
                    type="primary"
                    onClick={() => BackToMainTask(parentTask)}
                  >
                    Back to main tasks
                  </Button>
                )}
                <Row gutter={12}>
                  <Col className="gutter-row" span={16}>
                    <Space direction="horizontal">
                      <DropdownProps
                        type="Status"
                        text={taskData?.Status}
                        button={true}
                        taskId={taskData?._id}
                        id={'details'}
                        ignoreStt={statusIgnoreList}
                        onClickMenu={onChangeStatus}
                        task={taskData}
                      />
                      {editTaskName === false ? (
                        <p
                          className="bold-weight"
                          onClick={() => setEditTaskName(true)}
                        >
                          {taskData?.TaskName}
                        </p>
                      ) : (
                        <Input
                          maxLength={80}
                          defaultValue={taskData.TaskName}
                          onBlur={OnBlurTaskName}
                          autoFocus
                        />
                      )}
                    </Space>
                  </Col>
                  {showScore && (
                    <>
                      <Col
                        className="gutter-row"
                        span={2}
                        style={{ flex: 'revert' }}
                      >
                        <Space direction="horizontal" size={5}>
                          <Avatar
                            onClick={() => {
                              setMiniModal(true)
                            }}
                            style={{
                              borderColor: '#FACC15',
                              backgroundColor: 'white',
                            }}
                          >
                            <FontAwesomeIcon icon={faStar} color="#FACC15" />
                          </Avatar>
                          <p
                            style={{
                              fontSize: '18px',
                              color: '#0e7490',
                              fontWeight: 'bold',
                            }}
                          >
                            {taskData.Score!}
                          </p>
                        </Space>
                      </Col>
                    </>
                  )}
                  <Col
                    className="gutter-row"
                    span={4}
                    style={{ flex: 'revert', marginRight: '10px' }}
                  >
                    <CustomDatePicker
                      dueDateInput={taskData.DueDate?.toString()!}
                      //onChangeValue={OnChangeDateTime}
                      mode={UPDATE_MODE}
                      onOkEvent={onOkEvent}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    span={1}
                    style={{ flex: 'revert' }}
                  >
                    <DropdownProps
                      type={'Priority'}
                      text={taskData?.Priority ? taskData?.Priority : ''}
                      taskId={taskData?._id}
                      id={'details'}
                      task={taskData}
                    />
                  </Col>
                  {getUsers === false ? (
                    <>
                      <Col
                        className="gutter-row"
                        span={4}
                        style={{ flex: 'revert' }}
                      >
                        <UserListComp
                          userData={assigneeData}
                          maxCount={2}
                          icon={
                            <Avatar
                              style={{
                                borderColor: '#9CA3AF',
                                backgroundColor: 'white',
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faUserPlus}
                                color="#000000"
                              />
                            </Avatar>
                          }
                          tooltipText="Assignee"
                          inputUserData={taskData?.Assignee}
                          mode={UPDATE_MODE}
                          assigneeUpdate={true}
                          taskId={taskData._id}
                        />
                        {/*  <IconGroup
                  inputList={taskData?.Assignee as Users[]}
                  maxCount={5}
                /> */}
                      </Col>
                      <Col
                        className="gutter-row"
                        span={1}
                        style={{ flex: 'revert' }}
                      >
                        <UserListComp
                          userData={reporterData}
                          maxCount={3}
                          icon={
                            <Avatar
                              style={{
                                borderColor: '#9CA3AF',
                                backgroundColor: 'white',
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faUserCheck}
                                color="#000000"
                              />
                            </Avatar>
                          }
                          tooltipText="Reporter"
                          inputUserData={reporter}
                          mode={UPDATE_MODE}
                          taskId={taskData._id}
                        />
                      </Col>
                    </>
                  ) : (
                    <Spin size="large" />
                  )}
                </Row>
              </Space>
            </Header>
            <Content>
              <Row>
                <Col
                  span={16}
                  style={{
                    marginRight: '0.5%',
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ height: '500px', overflow: 'auto' }}>
                      <ReactQuill
                        //ref={reactQuillRef}
                        //id="bodyInput"

                        preserveWhitespace={true}
                        modules={{
                          toolbar: [
                            [
                              { font: [] },
                              { size: ['small', false, 'large', 'huge'] },
                            ], // custom dropdown

                            ['bold', 'italic', 'underline', 'strike'],

                            [{ color: [] }, { background: [] }],

                            /* [{ script: 'sub' }, { script: 'super' }], */

                            /* [
                        { header: 1 },
                        { header: 2 }, 
                        'blockquote',
                        'code-block',
                      ], */

                            [
                              { list: 'ordered' },
                              { list: 'bullet' },
                              /* { indent: '-1' },
                        { indent: '+1' }, */
                            ],

                            /* [{ direction: 'rtl' }, { align: [] }],

                      ['link', 'image', 'video', 'formula'],
                        
                      ['clean'] */
                            ['image'],
                          ],
                        }}
                        value={editorValue}
                        onChange={onChangeEditor}
                        style={{
                          height: '235px',
                          overflow: 'inline',
                        }}
                        onFocus={() => setSaveBtn(true)}
                        //onBlur={() => SaveEditor()}
                      ></ReactQuill>

                      {saveBtn === true && (
                        <Button
                          type="primary"
                          onClick={SaveEditor}
                          style={{ marginLeft: '10px' }}
                        >
                          Save
                        </Button>
                      )}
                      <br />
                      <br />
                      {assigneeData.length !== 0 ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {subTasksComp.map((element) => element.content)}

                          <Button
                            type="dashed"
                            onClick={AddTask}
                            block
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            disabled={!openSubTaskBtn}
                            style={{ width: '150px' }}
                          >
                            Add subtask
                          </Button>
                        </Space>
                      ) : (
                        <Spin />
                      )}
                    </div>
                    <Dragger {...props}>
                      <p className="ant-upload-text">Drag & drop here</p>
                    </Dragger>
                  </Space>
                </Col>
                <Col flex={8} style={{ height: '500px' }}>
                  <Tabs
                    defaultActiveKey="2"
                    items={items}
                    onChange={OnChange}
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 'thin',
                      borderRadius: '4px',
                      border: '1px solid #9CA3AF',
                      minHeight: '230px',
                      padding: '1%',
                      overflow: 'hidden',
                      position: 'relative',
                      //maxHeight: '450px',
                      height: '100%',
                    }}
                  />
                </Col>
              </Row>
            </Content>
          </Layout>
        ) : (
          <h1>Please wait</h1>
        )}
        <CustomFloatButton />
      </Modal>
      {loading === false ? (
        <ScoreComp
          task={taskData}
          readOnly={readOnly}
          openModal={miniModal}
          closeFunc={OnCloseFunc}
          updateFunc={OnCloseFunc}
          defaultScore={taskData.Score!}
        />
      ) : (
        <Spin />
      )}
    </>
  )
}

export default TaskDetails
