import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { getCookie } from 'typescript-cookie'
import { ProjectRequest } from '../../data/database/Project'
import { FilterRequestWithType } from '../../data/interface/FilterInterface'
import { AddProject } from '../../data/services/projectService'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { fetchFilterResult } from '../../redux/features/filter/filterSlice'
import {
  ACTIVE,
  ASSIGNEE,
  MANAGER,
  PROJECT,
  REPORTER,
  SELECT,
} from '../../util/ConfigText'
import Selector from '../selector/Selector'
import CustomerSelector from '../selector/CustomerSelector'
import '../../assets/css/index.css'

interface ProjectModalInput {
  openModal: boolean
  closeModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ProjectDetails: React.FC<ProjectModalInput> = ({
  openModal,
  closeModal,
}) => {
  const [form] = Form.useForm()
  const [assignee, setAssignee] = useState<string[]>([])
  const [reporter, setReporter] = useState<string[]>([])
  const [manager, setManager] = useState<string[]>([])
  const [clear, setClear] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [disableBtn, setDisableBtn] = useState(true)
  const filter = useAppSelector((state) => state.filter.filter)
  const dispatch = useAppDispatch()
  const projectName = Form.useWatch('ProjectName', form)
  const [customer, setCustomer] = useState<string>('')
  const [description, setDescription] = useState<string>()

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
      creator: getCookie('user_id'),
      creatorName: getCookie('user_name'),
      createDate: new Date(),
      status: ACTIVE,
      customer: customer,
      description: description,
    }

    const filterReq: FilterRequestWithType = {
      filter: filter,
      type: PROJECT,
    }

    await AddProject(project)
      .then((res) => {
        //handle success here
        setDisabled(false)
        setClear(true)
        closeModal(e)
        dispatch(fetchFilterResult(filterReq))
      })
      .catch(function (error) {
        console.log(error)
        setDisabled(false)
      })
    setDisableBtn(false)
  }

  const onFinishFailed = (errorInfo: any) => {
    setDisableBtn(false)
    setDisabled(false)
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Modal
        title="Create new project"
        open={openModal}
        onCancel={closeModal}
        width="50%"
        footer={[]}
        keyboard={false}
        maskClosable={false}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          //labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{
            remember: true,
            Layout: 'vertical',
            ['Description']: description,
          }}
          onFinish={onFinish}
          onFinishFailed={(e: any) => {
            onFinishFailed(e)
          }}
          autoComplete="on"
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
                <Input placeholder="Project Name" maxLength={50} />
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
                    initValue={[]}
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
                    initValue={[]}
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
                    initValue={[]}
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
              >
                Create
              </Button>
            </center>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ProjectDetails
