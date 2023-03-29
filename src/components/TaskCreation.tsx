import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Tooltip,
  Upload,
} from 'antd'
import type { UploadProps, DatePickerProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'
import DropdownProps from './Dropdown'
import { Users } from '../data/database/Users'
import { GetUserByType } from '../data/allUsersService'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { InsertTask } from '../data/tasksService'
import OverDueDate from '../util/OverDueDate'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getCookie, setCookie } from 'typescript-cookie'
import { useNavigate } from 'react-router-dom'
import { Tasks } from '../data/database/Tasks'
import SubTask from './SubTasks'
import {
  ASSIGNEE,
  DEFAULT_STT,
  INSERT_MODE,
  PROJECT,
  REPORTER,
  SELECT,
} from '../util/ConfigText'
import ObjectID from 'bson-objectid'
import { SubTaskCompProp, SubTaskProp } from '../data/interface/SubTaskProp'
import axios from 'axios'
import { AttachmentResponse } from '../data/database/Attachment'
import { fetchTasksAssignee } from '../redux/features/tasks/assigneeTaskSlice'
import { Params } from '../data/interface/task'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchTasksReporter } from '../redux/features/tasks/reporterTaskSlice'
import { CheckExtension } from '../util/Extension'
import { InputTasks } from '../data/database/InputTasks'
import { RemoveAttachment } from '../data/attachmentService'
import { SelectorValue } from '../data/interface/SelectorValue'
import RemoteSelectorSingle from './selector/RemoteSelectorSingle'
import { fetchFilterResult } from '../redux/features/filter/filterSlice'
import { FilterRequest } from '../data/interface/FilterInterface'
import { ProjectRepsonse, ProjectRequest } from '../data/database/Project'
import { GetUsersByProject } from '../data/projectService'

interface AttachmentProps {
  uid: string
  id: string
}

interface TaskCreationInput {
  openModal: boolean
  closeFunc: () => void
  projectValue?: SelectorValue
  isProjectFixed: boolean
  projectId?: string
}

let taskKey = 'Item'

const { Dragger } = Upload

const customFormat: DatePickerProps['format'] = (value) => {
  if (value.hour() === 23 && value.minute() === 59 && value.second() === 59) {
    return `${value.format('DD/MM')}`
  } else {
    return `${value.format('DD/MM hh:mm:ss')}`
  }
}

//const subTask: Tasks[] = []

const TaskCreation: React.FC<TaskCreationInput> = ({
  openModal,
  closeFunc,
  projectValue,
  isProjectFixed,
  projectId,
}) => {
  const id = ObjectID(new Date().getTime()).toHexString()
  const initFilter = useAppSelector((state) => state.filter)
  const navigate = useNavigate()
  //let reporterOptions: ItemProps[] = []
  const [disableBtn, setDisableBtn] = useState(true)
  const [editorValue, setEditorValue] = useState('')
  const [subTask, setSubTask] = useState<Tasks[]>([])

  const [taskName, setTaskName] = useState('')

  const [loading, setLoading] = useState(false)

  const [value, setValue] = useState<string[]>([])

  const [rep, setRep] = useState('')
  const [assignee, setAssignee] = useState('')
  const [assigneeData, setAssigneeData] = useState<Users[]>([])
  const [reporterData, setReporterData] = useState<Users[]>([])
  const [dueDate, setDueDate] = useState('')
  const [subTasksComp, setSubTaskComp] = useState<SubTaskCompProp[]>([])
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
    Status: '',
    Reporter: {},
    GroupPath: '',
    created: false,
  })

  const subTaskInput: Tasks = {
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
    Status: '',
    Reporter: {},
    GroupPath: '',
    created: false,
  }

  const [subTaskIdList, setSubTaskIdList] = useState<string[]>([])
  const [project, setProject] = useState<SelectorValue>()
  const [assigneeValue, setAssigneeValue] = useState<SelectorValue>()
  const [reporterValue, setReporterValue] = useState<SelectorValue>()

  const [attachment, setAttachment] = useState<AttachmentProps[]>([])
  const [disableSubmit, setDisableSubmit] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setAssigneeValue(undefined)
    setReporterValue(undefined)
  }, [project])

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
    data.append('taskId', id)
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
          setAttachment([
            ...attachment,
            { id: res[0]._id, uid: options.file.uid },
          ])
          options.onSuccess(res, options.file)
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
    //fileList: fileList,
    //name: 'file',
    multiple: false,
    action: process.env.REACT_APP_API_ATTACHMENTS_ADDATTACHMENT!,
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
    customRequest: customRequest,
    onPreview(file) {
      console.log('File ' + file)
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log('Not uploading ' + info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    async onRemove(file) {
      const _filtedFile = attachment.filter(
        (element) => element.uid === file.uid,
      )

      const response = await RemoveAttachment(_filtedFile[0].id)
      if (response.ErrorMessage) {
        message.error('Remove failed with error ' + response.ErrorMessage)
        return false
      } else {
        setAttachment(attachment.filter((element) => element.uid !== file.uid))
      }
      //setFileList(fileList.filter((element) => element !== file))
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const onChangeDate = (date: null | (Dayjs | null), dateStrings: string) => {
    if (date) {
      setDueDate(date.toString())
    } else {
      setDueDate('')
    }
  }

  const onChangeProject = (e: SelectorValue) => {
    setProject(e)
    setCookie('projectId', e.value)
    if (e.value) {
      if (e.value !== '') {
        setDisableBtn(false)
      } else {
        setDisableBtn(true)
      }
    } else {
      setDisableBtn(true)
    }
  }

  const onChangeAssigneeValue = (e: SelectorValue) => {
    setAssigneeValue(e)
  }

  const onChangeReporterValue = (e: SelectorValue) => {
    setReporterValue(e)
  }

  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    setEditorValue(editor.getContents())
  }

  const fetchData = useCallback(async () => {
    if (!isProjectFixed) {
      //no project
      const data = await GetUserByType(
        'api/users/getReporterOrAssignee',
        'assignee',
        getCookie('user_id')?.toString(),
      )
      setAssigneeData(data)

      const dataRp = await GetUserByType(
        'api/users/getReporterOrAssignee',
        'reporter',
        getCookie('user_id')?.toString(),
      )
      setReporterData(dataRp)
    } else {
      //have project

      const dataAssignee = await GetUsersByProject(
        getCookie('projectId')!,
        'assignee',
      )
      const data = dataAssignee.data as Users[]

      setAssigneeData(data)

      const dataReporter = await GetUsersByProject(
        getCookie('projectId')!,
        'reporter',
      )

      const dataRp = dataReporter.data as Users[]
      setReporterData(dataRp)
    }
  }, [])

  useEffect(() => {
    setSubTaskComp([])
    setOpenSubTaskBtn(true)
    setSubTask([])
    fetchData()
  }, [openModal])

  useEffect(() => {
    if (projectValue) {
      setProject(projectValue)
      setDisableBtn(false)
    } else {
      setDisableBtn(true)
    }
  }, [projectValue])

  const [form] = Form.useForm()
  const group = Form.useWatch('group', form)
  //const attachments = Form.useWatch('attachment', form)

  const onChangeReporter = (value: string) => {
    setRep(value)
    const users: Users = {
      _id: value,
    }
    setMyTask({ ...myTask, Reporter: users })
  }

  const onChangeAssignee = (value: string) => {
    setAssignee(value)
    const users: Users = {
      _id: value,
    }
    setMyTask({ ...myTask, Assignee: [users] })
  }

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      closeFunc()
    }, 3000)
  }

  const handleCancel = () => {
    setSubTaskIdList([])

    closeFunc()
  }

  const clearData = () => {
    setValue([])
  }

  const SubTaskCom: React.FC<SubTaskProp> = ({ index, subTaskId }) => {
    const onFinish = (values: any) => {
      console.log('Sucess ' + JSON.stringify(values))
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
      _task.ParentTask = id

      //subTask.push(_task)
      const subTaskFilter = subTask.filter((e) => e._id === _task._id)
      if (subTaskFilter.length === 0) {
        //insert

        subTask.push(_task)

        //setSubTask([...subTask, _task])
      } else {
        //update
        console.log('Update the id')
        for (let indexS = 0; indexS < subTask.length; indexS++) {
          if (subTask[indexS]._id === _task._id) {
            subTask[indexS] = _task
            break
          }
        }
      }
      setOpenSubTaskBtn(true)
    }

    const onFinishFailed = (values: any) => {
      console.log('Failed ' + JSON.stringify(values))
    }

    return assigneeData.length > 0 && reporterData.length > 0 ? (
      <Space direction="horizontal">
        <SubTask
          tasks={subTaskInput}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          assigneeData={assigneeData}
          reporterData={reporterData}
          mode={INSERT_MODE}
          taskId={subTaskId}
        />
      </Space>
    ) : (
      <Spin />
    )
  }

  const AddTask = () => {
    //console.log('Hello ' + subTasks.length)
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
          />
        ),
      }),
    )
    setOpenSubTaskBtn(false)
  }

  const onFinish = async (values: any) => {
    const subTaskFilter = subTask.filter(
      (element) =>
        element._id !== undefined && element._id !== null && element._id !== '',
    )

    //update the tasks that has id on SubTaskComp by getting the index of from SubTask
    setSubTaskComp((subTasksComp) => {
      return subTasksComp.filter((e) =>
        subTaskFilter.find(({ _id }) => e.id === _id),
      )
    })

    const idList: string[] = []
    subTaskFilter.forEach((element) => {
      idList.push(element._id!)
    })

    const _subTaskFilter: Tasks[] = [...subTaskFilter]
    _subTaskFilter.forEach((element) => {
      element.created = true
    })

    const _assignee: Users[] = []

    const _reporter: Users = {
      /* _id: rep ? rep : (getCookie('user_id') as string), */
      _id: reporterValue
        ? reporterValue.value
        : (getCookie('user_id') as string),
    }
    if (_assignee.length === 0) {
      /* _assignee.push({
        _id: assignee ? assignee : (getCookie('user_id') as string),
      }) */
      _assignee.push({
        _id: assigneeValue
          ? assigneeValue.value
          : (getCookie('user_id') as string),
      })
    }

    let attachmentList: string[] = []
    const attachmentItems: AttachmentProps[] = JSON.parse(
      JSON.stringify(attachment),
    )
    attachmentItems.map((element) => {
      attachmentList.push(element.id)
    })

    const myInputTask: Tasks = {
      _id: id,
      TaskName: taskName,
      Description: JSON.stringify(editorValue),
      Priority: sessionStorage.getItem('priority' + taskKey)?.toString()!
        ? sessionStorage.getItem('priority' + taskKey)?.toString()!
        : 'Medium',
      CreateDate: new Date(),
      //StartDate: new Date(startDate),
      Subtask: idList,
      DueDate: new Date(dueDate),
      Status: 'In progress',
      Assignee: _assignee,
      Reporter: _reporter,
      GroupPath: group,
      Watcher: [],
      Tag: [],
      Attachment: attachmentList,
      Comment: [],
      Project: project
        ? ({ _id: project.value } as ProjectRepsonse)
        : undefined,
    }

    _subTaskFilter.unshift(myInputTask)

    const myRealInputTask: InputTasks = {
      userId: getCookie('user_id')!.toString(),
      userName: getCookie('user_name')!.toString(),
      tasks: _subTaskFilter,
    }

    console.log('Project ' + JSON.stringify(myRealInputTask))
    //console.log('Attachment ' + JSON.stringify(attachmentList))
    await InsertTask(
      'api/task/addTaskWithSubtask',
      JSON.stringify(myRealInputTask),
    )
    form.resetFields()
    clearData()

    sessionStorage.setItem('priority' + taskKey, 'Medium')
    sessionStorage.setItem('status' + taskKey, 'To do')

    const params: Params = {
      serviceUrl: '',
      type: getCookie('user_id')?.toString()!,
      //userId: getCookie('user_id')?.toString(),
    }

    if (sessionStorage.getItem('tab')?.toString()) {
      if (sessionStorage.getItem('tab')?.toString() === '1') {
        //my work
        dispatch(fetchTasksAssignee(params))
      } else if (sessionStorage.getItem('tab')?.toString() === '2') {
        //report
        dispatch(fetchTasksReporter(params))
      } else {
        const filterRequest: FilterRequest = {
          filter: initFilter.filter,
        }
        dispatch(fetchFilterResult(filterRequest))
      }
    } else {
      //nothing here yet
    }
    setDisableSubmit(false)

    closeFunc()
  }

  const submitForm = () => {
    setDisableSubmit(true)
    form.submit()
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    setDisableSubmit(false)
  }

  return (
    <>
      <Modal
        open={openModal}
        title=""
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width="50%"
      >
        <br />
        <br />
        <Form
          form={form}
          name="basic"
          //labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, Layout: 'vertical' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            //label="Username"
            name="task name"
            rules={[
              { required: true, message: '' },
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('')),
              },
            ]}
          >
            <Input
              placeholder="Task Name"
              defaultValue={taskName}
              onBlur={(e) => {
                const _taskName = e.target.value.replace(/^\n|\n$/g, '')
                setTaskName(_taskName)
                setMyTask({ ...myTask, TaskName: _taskName })
              }}
            />
          </Form.Item>

          <Form.Item name="users" style={{ margin: '0 0 -0.2% 0' }}>
            <Input.Group compact>
              <Form.Item
                name="project"
                style={{ width: '44%', marginRight: '3%' }}
              >
                <RemoteSelectorSingle
                  type={PROJECT}
                  placeHolder={SELECT + ' ' + PROJECT}
                  initValue={projectValue}
                  disabled={projectValue ? true : false}
                  onChangeSelectorFunc={onChangeProject}
                />
              </Form.Item>
              <Form.Item name="assignee" style={{ width: '25%' }}>
                <RemoteSelectorSingle
                  type={ASSIGNEE}
                  placeHolder={SELECT + ' ' + ASSIGNEE}
                  onChangeSelectorFunc={onChangeAssigneeValue}
                  isProjectFixed={isProjectFixed}
                  projectId={project ? project.value : undefined}
                />
              </Form.Item>
              <Form.Item
                name="reporter"
                style={{ width: '25%', margin: '0 0 0 3%' }}
              >
                <RemoteSelectorSingle
                  type={REPORTER}
                  placeHolder={SELECT + ' ' + REPORTER}
                  onChangeSelectorFunc={onChangeReporterValue}
                  isProjectFixed={isProjectFixed}
                  projectId={project ? project.value : undefined}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item name="description">
            <ReactQuill
              //ref={reactQuillRef}
              preserveWhitespace={true}
              modules={{
                toolbar: [
                  [{ font: [] }, { size: ['small', false, 'large', 'huge'] }], // custom dropdown

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
                height: '150px',
                //maxHeight: '500px',
                overflow: 'inline',
              }}
            ></ReactQuill>
          </Form.Item>
          <br />
          <br />
          <Form.Item name="attachment">
            <Dragger {...props}>
              <p className="ant-upload-text">Drag & drop here</p>
            </Dragger>
          </Form.Item>

          <Space direction="vertical">
            <Space direction="vertical">
              <>
                {subTasksComp.map((element) => element.content)}
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
              </>
            </Space>
            <Space align="baseline" size={10}>
              <Tooltip placement="top" title="Priority">
                <Form.Item name="priority">
                  <DropdownProps
                    type={'Priority'}
                    text={'Medium'}
                    id={taskKey}
                  />
                </Form.Item>
              </Tooltip>

              <Form.Item name="dueDate">
                <Space direction="horizontal">
                  <DatePicker
                    className={'datePicker'}
                    placeholder=""
                    showTime={{
                      format: 'HH:mm:ss',
                      defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
                    }}
                    format={customFormat}
                    onChange={onChangeDate}
                    suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                    style={{
                      width: '32px',
                      boxSizing: 'border-box',
                      padding: '4px 9px 4px 0px',
                      borderBottomLeftRadius: '100px',
                      borderTopRightRadius: '100px',
                      borderTopLeftRadius: '100px',
                      borderBottomRightRadius: '100px',
                      WebkitBorderRadius: '100px',
                      cursor: 'pointer',
                    }}
                    //bordered={false}
                  />
                  {dueDate !== '' && (
                    <OverDueDate inputDate={new Date(dueDate)} />
                  )}
                </Space>
              </Form.Item>

              {/* <Form.Item
              name="tags"
            >
              <Button shape="circle">
                <FontAwesomeIcon icon={faTags} />
              </Button>
            </Form.Item> */}
            </Space>
          </Space>
          <Form.Item>
            <center>
              <Button
                type="primary"
                onClick={submitForm}
                disabled={disableSubmit}
              >
                Create Task
              </Button>
            </center>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default TaskCreation
