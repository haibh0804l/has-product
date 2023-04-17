import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback, useEffect, useState } from 'react'
import { getCookie } from 'typescript-cookie'
import { ProjectRepsonse, ProjectRequest } from '../data/database/Project'
import { FilterRequestWithType } from '../data/interface/FilterInterface'
import { GetProjectById, UpdateProject } from '../data/services/projectService'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import {
  ACTIVE,
  ASSIGNEE,
  MANAGER,
  PROJECT,
  REPORTER,
  SELECT,
} from '../util/ConfigText'
import Selector from '../components/selector/Selector'
import '../assets/css/index.css'
import CustomerSelector from '../components/selector/CustomerSelector'
import { useNavigate, useParams } from 'react-router-dom'
import { Users } from '../data/database/Users'
import { CustomRoutes } from '../customRoutes'
import { CustomerResponse } from '../data/database/Customer'

interface ProjectModalInput {
  openModal: boolean
  name: string
}

const ProjectDetails: React.FC<ProjectModalInput> = ({ openModal, name }) => {
  const taskId = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [open, setOpen] = useState(openModal)
  const [assignee, setAssignee] = useState<string[]>([])
  const [reporter, setReporter] = useState<string[]>([])
  const [manager, setManager] = useState<string[]>([])
  const [projectName, setProjectName] = useState<string>('')
  const [clear, setClear] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [disableBtn, setDisableBtn] = useState(true)
  const filter = useAppSelector((state) => state.filter.filter)
  const [customer, setCustomer] = useState<string>('')
  const [description, setDescription] = useState<string>()
  const [loaded, setLoaded] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const project = await GetProjectById(taskId.id!)
      const projectData: ProjectRepsonse[] = project.data

      const assigneeData = projectData[0].Assignee as Users[]
      const _assigneeData: string[] = []
      assigneeData.forEach((element) => _assigneeData.push(element._id!))

      const reporterData = projectData[0].Reporter as Users[]
      const _reporterData: string[] = []
      reporterData.forEach((element) => _reporterData.push(element._id!))

      const managerData = projectData[0].Manager as Users[]
      const _managerData: string[] = []
      managerData.forEach((element) => _managerData.push(element._id!))

      const customerData = projectData[0].Customer as CustomerResponse

      setProjectName(projectData[0].ProjectName!)
      setCustomer(customerData ? customerData._id : '')
      setAssignee(_assigneeData)
      setReporter(_reporterData)
      setManager(_managerData)
      setDescription(projectData[0].Description)
      setLoaded(true)
    } catch (error) {
      console.log(error)
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    setLoaded(false)
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (
      assignee.length === 0 ||
      reporter.length === 0 ||
      manager.length === 0
    ) {
      setDisableBtn(true)
    } else {
      setDisableBtn(false)
    }
  }, [assignee, reporter, manager])

  useEffect(() => {
    document.title = name
  }, [])

  const handleChangeAssignee = (value: string[]) => {
    setAssignee(value)
  }
  const handleChangeReporter = (value: string[]) => {
    setReporter(value)
  }
  const handleChangeManager = (value: string[]) => {
    setManager(value)
  }

  const onRemoveAssignee = (e: string) => {
    setAssignee(assignee.filter((element) => element !== e))
  }
  const onRemoveReporter = (e: string) => {
    setReporter(reporter.filter((element) => element !== e))
  }
  const onRemoveManager = (e: string) => {
    setManager(manager.filter((element) => element !== e))
  }

  const onChangeCustomer = (e: any) => {
    if (e) {
      console.log(e)
      setCustomer(e)
    }
  }

  const submitForm = () => {
    setDisabled(true)
    setDisableBtn(true)
    form.submit()
  }

  const onFinish = async (e: any) => {
    const project: ProjectRequest = {
      projectName: projectName,
      assignee: assignee,
      reporter: reporter,
      manager: manager,

      status: ACTIVE,
      customer: customer,
      description: description,
    }

    await UpdateProject(taskId.id!, project)
      .then((res) => {
        //handle success here
        setDisabled(false)
        setClear(true)
        //closeModal(e)
        setDisableBtn(false)
        BackToMyWork()
      })
      .catch(function (error) {
        message.error('' + error)
        setDisabled(false)
        setDisableBtn(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    setDisableBtn(false)
    setDisabled(false)
    console.log('Failed:', errorInfo)
  }

  const BackToMyWork = () => {
    setOpen(false)
    navigate(CustomRoutes.MyWork.path, {
      state: {
        refresh: true,
      },
    })
  }

  return (
    <>
      <Modal
        title="Edit Project"
        open={open}
        onCancel={() => BackToMyWork()}
        width="50%"
        footer={[]}
        keyboard={false}
        maskClosable={false}
      >
        {loaded ? (
          <Form
            form={form}
            name="basic"
            layout="vertical"
            //labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            initialValues={{
              remember: true,
              Layout: 'vertical',
              ['ProjectName']: projectName,
              ['Description']: description,
            }}
            onFinish={onFinish}
            onFinishFailed={(e: any) => {
              onFinishFailed(e)
            }}
            autoComplete="off"
            disabled={disabled}
          >
            <Row gutter={10} align="middle">
              <Col span={10}>
                <Form.Item
                  label="Customer Name"
                  name="CustomerName"
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.additional !== curValues.additional
                  }
                  style={{
                    marginRight: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <CustomerSelector
                    disabled={false}
                    onChange={onChangeCustomer}
                    initValue={customer}
                  />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  label="Project Name"
                  name="ProjectName"
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
                  style={{ marginBottom: '12px' }}
                >
                  <Input
                    placeholder="Project Name"
                    name="ProjectName"
                    maxLength={50}
                    showCount
                    onBlur={(e) => setProjectName(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="Description"
              shouldUpdate={(prevValues, curValues) =>
                prevValues.additional !== curValues.additional
              }
              style={{ marginBottom: '5px' }}
            >
              <TextArea
                name="Description"
                onBlur={(e) => setDescription(e.target.value)}
                placeholder="Description"
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Space
              direction="vertical"
              style={{ width: '100%', marginBottom: '2%' }}
            >
              <b>Project Team</b>
              <Row gutter={10}>
                <Col span={8} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <p>Assignee</p>
                    <Selector
                      placeHolder={SELECT + ' ' + ASSIGNEE}
                      type={ASSIGNEE}
                      onChangeFunc={handleChangeAssignee}
                      onDeleteTag={onRemoveAssignee}
                      clearAll={clear}
                      initValue={assignee}
                    />
                  </Space>
                </Col>
                <Col span={8} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <p>Reporter</p>
                    <Selector
                      placeHolder={SELECT + ' ' + REPORTER}
                      type={REPORTER}
                      onChangeFunc={handleChangeReporter}
                      onDeleteTag={onRemoveReporter}
                      clearAll={clear}
                      initValue={reporter}
                    />
                  </Space>
                </Col>
                <Col span={8} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <p>Manager</p>
                    <Selector
                      placeHolder={SELECT + ' ' + MANAGER}
                      type={MANAGER}
                      onChangeFunc={handleChangeManager}
                      onDeleteTag={onRemoveManager}
                      clearAll={clear}
                      initValue={manager}
                    />
                  </Space>
                </Col>
              </Row>
            </Space>
            <Form.Item>
              <center>
                <Button
                  type="primary"
                  onClick={() => submitForm()}
                  disabled={disableBtn}
                  style={{ marginRight: '10px' }}
                >
                  Update
                </Button>
                <Button
                  type="primary"
                  onClick={() => BackToMyWork()}
                  disabled={disableBtn}
                  style={{ backgroundColor: '#DC3545' }}
                >
                  Cancel
                </Button>
              </center>
            </Form.Item>
          </Form>
        ) : (
          <Spin size="large" />
        )}
      </Modal>
    </>
  )
}

export default ProjectDetails
