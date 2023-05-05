import { faEye, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Divider, message, Modal, Row, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import { Tasks } from '../../data/database/Tasks'
import { SelectorValue } from '../../data/interface/SelectorValue'
import { statusData } from '../../data/statusData'
import { GENERIC_ERROR, PROJECT, PROJECT_WARNING } from '../../util/ConfigText'
import '../../assets/css/index.css'
import {
  GetTaskSummary,
  UpdateProject,
} from '../../data/services/projectService'
import {
  ProjectRequest,
  TaskSummaryResponse,
} from '../../data/database/Project'
import { fetchFilterResult } from '../../redux/features/filter/filterSlice'
import { FilterRequestWithType } from '../../data/interface/FilterInterface'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'

interface ProjectEndInput {
  openModal: boolean
  handleOk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  closeFunc?: () => void
  project: SelectorValue
}

interface DataType {
  key: string
  status: React.ReactNode
  numberOfTask: React.ReactNode
}

interface NumberOfTasksInput {
  status: string
  taskLength: number
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

const ProjectEnd: React.FC<ProjectEndInput> = ({
  openModal,
  handleOk,
  handleCancel,
  closeFunc,
  project,
}) => {
  const [innerProject, setInnerProject] = useState<SelectorValue>(project)
  const [numOfTasks, setNumOfTasks] = useState<number>(0)
  const [showConfirmBtn, setShowConfirmBtn] = useState(true)
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  const SetTableData: React.FC<NumberOfTasksInput> = ({
    status,
    taskLength,
  }) => {
    return (
      <Space direction="horizontal">
        <p
          style={{
            color: statusData.filter(
              (element) => element.name.toLowerCase() === status.toLowerCase(),
            )[0].color,
            fontWeight: 'bold',
          }}
        >
          {taskLength}
        </p>
        tasks
      </Space>
    )
  }
  const defaultInput: DataType[] = [
    {
      key: 'Completed',
      status: 'COMPLETED',
      numberOfTask: <SetTableData status={'Completed'} taskLength={0} />,
    },
    {
      key: 'Incompleted',
      status: 'INCOMPLETED',
      numberOfTask: <SetTableData status={'Incompleted'} taskLength={0} />,
    },
    {
      key: 'Done',
      status: 'DONE',
      numberOfTask: <SetTableData status={'Done'} taskLength={0} />,
    },
    {
      key: 'In progress',
      status: 'IN PROGRESS',
      numberOfTask: <SetTableData status={'In progress'} taskLength={0} />,
    },
  ]

  const [dataInput, setDataInput] = useState<DataType[]>(defaultInput)

  const fetchData = useCallback(async (proj: string) => {
    try {
      const taskSummary = await GetTaskSummary(proj)
      if (taskSummary.status === 200) {
        const data: TaskSummaryResponse[] = taskSummary.data
        setNumOfTasks(data[0].TotalTask)
        const _data: DataType[] = []
        let _showConfirm: boolean = true
        //set Data
        if (data[0].TotalTask > 0) {
          for (let index = 0; index < data[0].Summary.length; index++) {
            const element = data[0].Summary[index]
            if (
              element.Status.toLowerCase() === 'Done'.toLowerCase() ||
              element.Status.toLowerCase() === 'In progress'.toLowerCase()
            ) {
              if (element.Count > 0) {
                _showConfirm = false
              }
            }
            _data.push({
              key: element.Status,
              status: element.Status.toUpperCase(),
              numberOfTask: (
                <SetTableData
                  status={element.Status}
                  taskLength={element.Count}
                />
              ),
            })
          }

          setDataInput(_data)
          setShowConfirmBtn(_showConfirm)
        } else {
          setDataInput(defaultInput)
          setShowConfirmBtn(true)
        }
      } else {
        message.error(GENERIC_ERROR)
        setShowConfirmBtn(false)
      }
    } catch (error: any) {
      message.error(GENERIC_ERROR)
      setShowConfirmBtn(false)
    }
  }, [])

  const closeProject = async (e: any) => {
    const projectRequest: ProjectRequest = {
      status: 'Inactive',
    }
    try {
      const projectRespone = await UpdateProject(
        innerProject.value,
        projectRequest,
      )
      const filterRequest: FilterRequestWithType = {
        filter: filterInit.filter,
        type: PROJECT,
      }
      dispatch(fetchFilterResult(filterRequest))
      handleCancel(e)
    } catch (error) {
      message.error('Close project failed. Please try again later ' + error)
    }
  }

  useEffect(() => {
    if (project.value !== '') {
      setInnerProject(project)
      fetchData(project.value)
    }
  }, [project])

  return (
    <Modal
      open={openModal}
      title="Close project"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          {showConfirmBtn && (
            <Button type="primary" onClick={(e) => closeProject(e)}>
              Confirm
            </Button>
          )}
          <Button
            type="primary"
            onClick={(e) => handleCancel(e as any)}
            style={{ backgroundColor: '#DC3545' }}
          >
            Cancel
          </Button>
        </>
      }
      width="25%"
    >
      {innerProject.value !== '' && (
        <>
          <Divider
            style={{ margin: '10px 0px 10px 0px', backgroundColor: '#F6F1F1' }}
          />
          <Space direction="vertical" style={{ width: '100%' }}>
            <span>{project.label}</span>
            <span>
              Tổng số lượng task: <b>{numOfTasks}</b> tasks
            </span>
            <Table
              rowClassName={(record, index) => {
                return 'project-end-row'
              }}
              bordered={true}
              showHeader={false}
              pagination={false}
              columns={columns}
              dataSource={dataInput}
            />
          </Space>
          {!showConfirmBtn && (
            <Row gutter={10} align="middle" style={{ marginTop: '10px' }}>
              <Col>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  size={'2x'}
                  color="#FFC107"
                />
              </Col>
              <Col>
                <p style={{ color: 'red', fontSize: '12px' }}>
                  {PROJECT_WARNING}
                </p>
              </Col>
            </Row>
          )}
          <Divider
            style={{ margin: '10px 0px 10px 0px', backgroundColor: '#F6F1F1' }}
          />
        </>
      )}
    </Modal>
  )
}

export default ProjectEnd
