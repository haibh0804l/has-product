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
import {
  NavigationType,
  useLocation,
  useMatches,
  useNavigate,
  useNavigationType,
  useParams,
} from 'react-router-dom'
import {
  faChevronLeft,
  faEye,
  faPaperclip,
  faPlus,
  faStar,
  faTabletButton,
  faTrash,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { CustomRoutes } from '../customRoutes'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  GetTasksById,
  InsertTask,
  UpdateTask,
} from '../data/services/tasksService'
import { InputTasks } from '../data/database/InputTasks'
import _ from 'lodash'
import {
  DEFAULT_STT,
  DESCRIPTION,
  HIDE,
  READONLY,
  SHOW,
  SUMMARY,
  TYPE,
  UPDATE_FAIL,
  UPDATE_MODE,
} from '../util/ConfigText'
import CustomFloatButton from '../components/QuickCreate'
import { GetUserByType } from '../data/services/allUsersService'
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
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchHistory } from '../redux/features/history/historySlice'
import { AttachmentResponse } from '../data/database/Attachment'
import axios from 'axios'
import { RemoveAttachment } from '../data/services/attachmentService'
import { CheckExtension } from '../util/Extension'
import { SocketContext } from '../context'
import { GetUsersByProject } from '../data/services/projectService'
import { ProjectRequest } from '../data/database/Project'
import { TaskDetailsProps } from '../data/interface/ComponentsJson'

import Auth from '../util/Auth'
import CustomFileList from '../components/CustomFileList'

interface TaskData {
  taskData?: Tasks
  openModal: boolean
  name: string
}

interface ReactQuillDeltaOps {
  ops: ReactQuillData[]
}

interface ReactQuillData {
  insert: string
}

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

const TaskDetails: React.FC<TaskData> = ({ openModal, name }) => {
  const taskId = useParams()
  const navigate = useNavigate()

  const location = useLocation()
  const [parentTask, setParentTask] = useState('')
  //const taskData = location.state.taskData as Tasks // Read values passed on state
  let assignee: Users[] = []
  const [loading, setLoading] = useState(true)
  const [editorValue, setEditorValue] = useState('')
  const [summaryValue, setSummaryValue] = useState('')
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
    SummaryReport: '',
  })

  const [haveParentTask, setHaveParentTask] = useState(false)
  const [open, setOpen] = useState(openModal)
  const [editTaskName, setEditTaskName] = useState(false)
  const [assigneeData, setAssigneeData] = useState<Users[]>([])
  const [reporterData, setReporterData] = useState<Users[]>([])
  const [getUsers, setGetUsers] = useState(false)
  const [saveBtn, setSaveBtn] = useState(false)
  const [saveBtnSummary, setSaveBtnSummary] = useState(false)
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
    SummaryReport: '',
  })

  const [miniModal, setMiniModal] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [statusIgnoreList, setStatusIgnoreList] = useState<Status[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [attachmentIdList, setAttachmentIdList] = useState<string[]>([])
  const socket = useContext(SocketContext)
  const [isConnected, setIsConnected] = useState(socket.connected)
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)
  const dispatch = useAppDispatch()
  const [saved, setSaved] = useState(false)
  const [savedSummary, setSavedSummary] = useState(false)
  const [disableSummary, setDisableSummary] = useState(false)
  const [defaultTab, setDefaultTab] = useState('Description')
  const [isSaved, setIsSaved] = useState(false)
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState(
    TYPE + ' ' + DESCRIPTION,
  )
  const [summaryPlaceholder, setSummaryPlaceholder] = useState(
    TYPE + ' ' + SUMMARY,
  )

  //component state
  const [isTaskNameReadOnly, setIsTasknameReadOnly] = useState(false)
  const [isDescriptionReadOnly, setIsDescriptionReadOnly] = useState(false)
  const [isSummaryReadOnly, setSummaryReadOnly] = useState(false)
  const [isDateReadOnly, setIsDateReadOnly] = useState(false)
  const [isStatusReadOnly, setStatusReadOnly] = useState(false)
  const [isPriorityReadOnly, setIsPriorityReadOnly] = useState(false)
  const [isAssigneeReadOnly, setIsAssigneeReadOnly] = useState(false)
  const [isReporterReadOnly, setIsReporterReadOnly] = useState(false)
  const [isCommentReadOnly, setIsCommentReadOnly] = useState(false)
  const [isDisableUpload, setIsDisableUpload] = useState(false)
  const [isDisableDeleteFile, setIsDisableDeleteFile] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const [isNotAuthorize, setIsNotAuthorize] = useState(false)
  const [canCreatedSubtask, setCanCreateSubtask] = useState(false)
  const [isSubtaskReadOnly, setIsSubtaskReadOnly] = useState(false)

  /* const navType: NavigationType = useNavigationType()

  useEffect(() => {
    console.log(navType)
  }, [navType]) */

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
    disabled: isDisableUpload,
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
      //console.log('Dropped files', e.dataTransfer.files)
    },
    showUploadList: false,
  }

  const items: TabsProps['items'] = [
    {
      key: 'comments',
      label: `Comments`,
      children: (
        <Comments taskId={taskData._id!} disabled={isCommentReadOnly} />
      ),
    },
    {
      key: 'history',
      label: `History`,
      children: (
        <HistoryComponent collection={'Tasks'} documentId={taskData._id!} />
      ),
    },
  ]
  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    setEditorValue(editor.getContents())
    setSaved(!saved)
  }

  const onChangeSummaryEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    setSummaryValue(editor.getContents())
    setSavedSummary(!savedSummary)
  }

  const SaveEditor = async () => {
    if (!isDescriptionReadOnly) {
      setSaveBtn(false)
      const inputTask: InputTasks = {
        Description: JSON.stringify(editorValue),
      }
      await UpdateTask('/api/task/', taskData._id!, inputTask)
    }
  }

  const SaveSummaryEditor = async () => {
    if (!isSummaryReadOnly) {
      setSaveBtnSummary(false)
      const inputTask: InputTasks = {
        SummaryReport: JSON.stringify(summaryValue),
      }
      await UpdateTask('/api/task/', taskData._id!, inputTask)
    }
  }

  const onRemoveFile = async (value: string) => {
    const response = await RemoveAttachment(value, taskData._id!)
    if (response.ErrorMessage) {
      message.error('Remove failed with error ' + response.ErrorMessage)
      return false
    } else {
      message.success('Remove succeed')
      setFileList(fileList.filter((element) => element.uid !== value))
      setAttachmentIdList(
        attachmentIdList.filter((element) => element !== value),
      )
    }
  }

  const itemSummary: TabsProps['items'] = [
    {
      key: 'Description',
      label: `Description`,
      children: (
        <>
          <ReactQuill
            placeholder={descriptionPlaceholder}
            readOnly={isDescriptionReadOnly}
            preserveWhitespace={true}
            modules={
              !isDescriptionReadOnly
                ? {
                    toolbar: [
                      [
                        { font: [] },
                        { size: ['small', false, 'large', 'huge'] },
                      ], // custom dropdown

                      ['bold', 'italic', 'underline', 'strike'],

                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['image'],
                    ],
                  }
                : { toolbar: false }
            }
            value={editorValue}
            onChange={(content: any, delta: any, source: any, editor: any) => {
              setIsSaved(true)
              onChangeEditor(content, delta, source, editor)
            }}
            onKeyDown={() => {
              if (!isDescriptionReadOnly) !saveBtn && setSaveBtn(true)
            }}
            style={{
              height: '325px',
              marginBottom: '50px',
              //overflow: 'inline',
            }}
            onFocus={() => {
              if (!isDescriptionReadOnly) !saveBtn && setSaveBtn(true)
            }}
          ></ReactQuill>
          {saveBtn === true && (
            <Button
              type="primary"
              onClick={SaveEditor}
              style={{ marginLeft: '16px', float: 'right' }}
            >
              Save
            </Button>
          )}
        </>
      ),
    },
    {
      key: 'Summarry',
      label: `Summary Report`,
      disabled: disableSummary,
      children: (
        <>
          <ReactQuill
            placeholder={summaryPlaceholder}
            readOnly={isSummaryReadOnly}
            preserveWhitespace={true}
            modules={
              !isSummaryReadOnly
                ? {
                    toolbar: [
                      [
                        { font: [] },
                        { size: ['small', false, 'large', 'huge'] },
                      ], // custom dropdown

                      ['bold', 'italic', 'underline', 'strike'],

                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['image'],
                    ],
                  }
                : { toolbar: false }
            }
            value={summaryValue}
            onChange={onChangeSummaryEditor}
            style={{
              /* height: '325px',
              overflow: 'inline', */
              height: '325px',
              marginBottom: '50px',
            }}
            onKeyDown={() => {
              if (!isSummaryReadOnly) {
                if (!saveBtnSummary) {
                  setSaveBtnSummary(true)
                }
              }
            }}
            onFocus={() => {
              if (!isSummaryReadOnly) {
                if (!saveBtnSummary) {
                  setSaveBtnSummary(true)
                }
              }
            }}
          ></ReactQuill>

          {saveBtnSummary === true && (
            <Button
              type="primary"
              onClick={SaveSummaryEditor}
              style={{ marginLeft: '16px', float: 'right' }}
            >
              Save
            </Button>
          )}
        </>
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
        search: '/' + taskData._id,
      },
    })
    navigate(0)
  }

  const onChangeStatus: MenuProps['onClick'] = (e) => {
    fetchData()
    setGetUsers(false)
  }

  const fetchData = useCallback(async () => {
    setGetUsers(true)

    const data = await GetTasksById(
      '/api/task/getonetask/',
      taskId.id as string,
    )
    if (data.length === 0) {
      navigate(CustomRoutes.NotFound.path, { replace: true })
      return
    }
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

    //parent Task
    if (data[0].ParentTask) {
      setHaveParentTask(true)
      setParentTask(data[0].ParentTask)
    }

    let desc = ''
    try {
      desc = JSON.parse(data[0].Description)
    } catch (e) {}
    setEditorValue(desc)

    let summ = ''
    try {
      const _summ: ReactQuillDeltaOps = JSON.parse(data[0].SummaryReport!)
      summ = JSON.parse(data[0].SummaryReport!)
      let _stringTotal = ''
      for (let index = 0; index < _summ.ops.length; index++) {
        const element = _summ.ops[index]
        _stringTotal += element.insert
      }
      if (!_stringTotal.replace(/\s/g, '').length) {
        console.log('Length 0')
        //length = 0
        if (userInfo._id === data[0].Assignee[0]._id) {
          if (data[0].Assignee[0]._id === data[0].Reporter._id) {
            setDefaultTab('Description')
          } else {
            setDefaultTab('Description')
          }
          //setDisableSummary(true)
        } else {
          if (userInfo._id === data[0].Reporter._id) {
            if (data[0].Assignee[0]._id === data[0].Reporter._id) {
              setDefaultTab('Description')
            } else {
              setDefaultTab('Description')
              setDisableSummary(true)
            }
          }
        }
      } else {
        console.log('Length > 0')
        //length > 0
        if (userInfo._id === data[0].Assignee[0]._id) {
          if (data[0].Assignee[0]._id === data[0].Reporter._id) {
            setDefaultTab('Description')
          } else {
            setDefaultTab('Description')
          }
          //setDisableSummary(true)
        } else {
          if (userInfo._id === data[0].Reporter._id) {
            if (data[0].Assignee[0]._id === data[0].Reporter._id) {
              setDefaultTab('Summarry')
            } else {
              setDefaultTab('Summarry')
              setDisableSummary(false)
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
      //error : length = 0
      if (userInfo._id === data[0].Assignee[0]._id) {
        if (data[0].Assignee[0]._id === data[0].Reporter._id) {
          setDefaultTab('Description')
        } else {
          setDefaultTab('Description')
        }
        //setDisableSummary(true)
      } else {
        if (userInfo._id === data[0].Reporter._id) {
          if (data[0].Assignee[0]._id === data[0].Reporter._id) {
            setDefaultTab('Description')
          } else {
            setDefaultTab('Description')
            setDisableSummary(true)
          }
        }
      }
    }
    //console.log('My report ' + data[0].SummaryReport!)
    setSummaryValue(summ)

    let managers: string[] = []
    if (!data[0].Project) {
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
    } else {
      if (Object.keys(data[0].Project).length === 0) {
        //no project
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
      } else {
        const dataAssignee = await GetUsersByProject(
          data[0].Project._id!,
          'assignee',
        )
        const dataRes = dataAssignee.data as Users[]

        setAssigneeData(dataRes)

        const dataRp = await GetUsersByProject(data[0].Project._id!, 'reporter')

        const dataRpData = dataRp.data as Users[]

        setReporterData(dataRpData)

        managers = data[0].Project.Manager! as string[]
      }
    }
    //get RBCA
    const props: TaskDetailsProps = Auth(
      getCookie('user_id')!,
      data[0].Assignee[0]._id!,
      data[0].Reporter._id!,
      managers,
    )

    setIsTasknameReadOnly(props.isTaskNameReadOnly)
    setIsDescriptionReadOnly(props.isDescriptionReadOnly)
    if (props.isDescriptionReadOnly) {
      setDescriptionPlaceholder('')
    }
    setSummaryReadOnly(props.isSummaryReadOnly)
    if (props.isSummaryReadOnly) {
      setSummaryPlaceholder('')
    }
    setIsDateReadOnly(props.isDateReadOnly)
    setStatusReadOnly(props.isStatusReadOnly)
    setIsPriorityReadOnly(props.isPriorityReadOnly)
    setIsAssigneeReadOnly(props.isAssigneeReadOnly)
    setIsReporterReadOnly(props.isReporterReadOnly)
    setIsCommentReadOnly(props.isCommentReadOnly)
    setIsDisableUpload(props.isDisableUpload)
    setIsDisableDeleteFile(props.isDisableDeleteFile)
    setReadOnly(props.readOnly)
    setIsNotAuthorize(props.isNotAuthorize)
    setCanCreateSubtask(props.canCreatedSubtask)
    setIsSubtaskReadOnly(props.isSubtaskReadOnly)

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
    document.title = name
    socket.on('connection', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socket.off('connection')
      socket.off('disconnect')
    }
  }, [])

  /* useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isSaved) {
        const inputTask: InputTasks = {
          Description: JSON.stringify(editorValue),
        }
        if (taskData._id && !isDescriptionReadOnly) {
          UpdateTask('/api/task/', taskData._id!, inputTask).then((r) => {})
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [saved]) */

  /* useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const inputTask: InputTasks = {
        SummaryReport: JSON.stringify(summaryValue),
      }
      if (taskData._id && !isSummaryReadOnly) {
        UpdateTask('/api/task/', taskData._id!, inputTask).then((r) => {})
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [savedSummary]) */

  // co

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

      if (getCookie('projectId')) {
        _task.Project = { _id: getCookie('projectId') } as ProjectRequest
      }

      if (taskData.Project) {
        _task.Project = { _id: taskData.Project._id } as ProjectRequest
      }

      _task.ParentTask = taskId.id as string
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
        noLoad={true}
        disabled={isSubtaskReadOnly}
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
        // style={{ top: '10vh' }}
      >
        {!isNotAuthorize ? (
          loading === false ? (
            <Layout>
              <Header style={{ height: '20%', marginLeft: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {haveParentTask === true && (
                    <Button
                      //style={{ padding: '0px' }}
                      type="primary"
                      //icon={<FontAwesomeIcon icon={faChevronLeft} />}
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
                          disabled={isStatusReadOnly}
                        />
                        {isTaskNameReadOnly ? (
                          <p className="bold-weight">{taskData?.TaskName}</p>
                        ) : editTaskName === false ? (
                          <p
                            className="bold-weight"
                            onClick={() => setEditTaskName(true)}
                          >
                            {taskData?.TaskName}
                          </p>
                        ) : (
                          <Input
                            showCount
                            maxLength={100}
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
                      flex="revert"
                      style={{ marginRight: '10px' }}
                    >
                      <CustomDatePicker
                        disabled={isDateReadOnly}
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
                        disabled={isPriorityReadOnly}
                        mode={UPDATE_MODE}
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
                            disabled={isAssigneeReadOnly}
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
                        </Col>
                        <Col
                          className="gutter-row"
                          span={1}
                          style={{ flex: 'revert' }}
                        >
                          <UserListComp
                            disabled={isReporterReadOnly}
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
                      <div style={{ height: '26.8rem', overflow: 'auto' }}>
                        <Tabs
                          defaultActiveKey={defaultTab}
                          onChange={OnChange}
                          items={itemSummary}
                          style={{
                            borderStyle: 'solid',
                            borderWidth: 'thin',
                            borderRadius: '4px',
                            border: '1px solid #9CA3AF',
                            minHeight: '450px',
                            padding: '1%',
                            overflow: 'hidden',
                            position: 'relative',
                            //maxHeight: '450px',
                            height: 'max-content',
                          }}
                        />

                        <br />
                        <br />
                        {assigneeData.length !== 0 ? (
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {subTasksComp.map((element) => element.content)}
                            {canCreatedSubtask && (
                              <Button
                                type="dashed"
                                onClick={AddTask}
                                block
                                icon={<FontAwesomeIcon icon={faPlus} />}
                                disabled={!openSubTaskBtn}
                                style={{ width: '150px' }}
                              >
                                Subtask
                              </Button>
                            )}
                            <CustomFileList
                              files={fileList}
                              onRemove={onRemoveFile}
                              isDeleteDisabled={isDisableDeleteFile}
                            />
                          </Space>
                        ) : (
                          <Spin />
                        )}
                      </div>
                      <Dragger {...props}>
                        <p className="ant-upload-text">
                          Drag & drop here or <a>browse</a>
                        </p>
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
                        minHeight: '325px',
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
          )
        ) : (
          <h1>You are not authorized to perform this operation</h1>
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
