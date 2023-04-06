import { Button, Col, Form, Input, Modal, Row, Select, Space, Tag } from 'antd'
import { assign } from 'lodash'
import { useEffect, useState } from 'react'
import { getCookie } from 'typescript-cookie'
import { ProjectRequest } from '../data/database/Project'
import { Users } from '../data/database/Users'
import {
  FilterRequest,
  FilterRequestWithType,
} from '../data/interface/FilterInterface'
import { AddProject } from '../data/projectService'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchFilterResult } from '../redux/features/filter/filterSlice'
import {
  ASSIGNEE,
  MANAGER,
  PROJECT,
  REPORTER,
  SELECT,
} from '../util/ConfigText'
import Selector from './selector/Selector'
import UserSelector from './selector/UserSelector'

interface ProjectModalInput {
  openModal: boolean
  closeModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ProjectModal: React.FC<ProjectModalInput> = ({
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
    setAssignee(assignee.filter((element) => element != e))
  }
  const onRemoveReporter = (e: string) => {
    setReporter(reporter.filter((element) => element != e))
  }
  const onRemoveManager = (e: string) => {
    setManager(manager.filter((element) => element != e))
  }

  const submitForm = () => {
    setDisabled(true)
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
          //labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, Layout: 'vertical' }}
          onFinish={onFinish}
          onFinishFailed={(e: any) => {
            onFinishFailed(e)
          }}
          autoComplete="off"
          disabled={disabled}
        >
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
          >
            <Input placeholder="Project Name" maxLength={50} />
          </Form.Item>
          <Space
            direction="vertical"
            style={{ width: '100%', marginBottom: '2%' }}
          >
            <p>Project Team</p>
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

export default ProjectModal
