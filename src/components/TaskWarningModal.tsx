import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Divider, message, Modal, Row, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import '../assets/css/index.css'
import { StatusCategory } from '../data/database/Categories'
import { Tasks } from '../data/database/Tasks'
import { GetTasksById } from '../data/services/tasksService'
import { getCookie } from 'typescript-cookie'
import { GENERIC_ERROR } from '../util/ConfigText'

interface TaskWarningInput {
  openModal: boolean
  task?: Tasks
  handleOk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  closeFunc?: () => void
}

interface DataType {
  key: string
  status: React.ReactNode
  numberOfTask: React.ReactNode
}

interface NumberOfTasksInput {
  statusId: number
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

const TaskWarningModal: React.FC<TaskWarningInput> = ({
  openModal,
  task,
  handleOk,
  handleCancel,
  closeFunc,
}) => {
  const [numOfSubtask, setNumOfSubtask] = useState(0)
  const _status = JSON.parse(
    localStorage.getItem('statusData')!,
  ) as StatusCategory[]

  const SetTableData: React.FC<NumberOfTasksInput> = ({
    statusId,
    taskLength,
  }) => {
    return (
      <Space direction="horizontal">
        <p
          style={{
            color: _status.filter(
              (element) => element.CategoryId === statusId,
            )[0].Color,
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
      key: 'Done',
      status: 'DONE',
      numberOfTask: <SetTableData statusId={2} taskLength={0} />,
    },
    {
      key: 'In progress',
      status: 'IN PROGRESS',
      numberOfTask: <SetTableData statusId={1} taskLength={0} />,
    },
  ]

  const [dataInput, setDataInput] = useState<DataType[]>(defaultInput)
  const fetchData = useCallback(async (taskId: string) => {
    try {
      const response = await GetTasksById('', taskId!, getCookie('user_id')!)

      const subTasks: Tasks[] = response[0].Subtask ? response[0].Subtask : []
      if (subTasks && subTasks.length > 0) {
        const inProgressSubTask = subTasks.filter(
          (element) =>
            (element.StatusCategory as StatusCategory).CategoryId == 1 ||
            (element.StatusCategory as StatusCategory).CategoryId == 2,
        )
        if (inProgressSubTask.length > 0) {
          const _inProgressSubTask = subTasks.filter(
            (element) =>
              (element.StatusCategory as StatusCategory).CategoryId == 1,
          )
          const _doneSubTask = subTasks.filter(
            (element) =>
              (element.StatusCategory as StatusCategory).CategoryId == 2,
          )
          setNumOfSubtask(inProgressSubTask.length)

          const numOfInprogress = _inProgressSubTask.length
          const numOfDone = _doneSubTask.length
          if (numOfInprogress > 0 && numOfDone > 0) {
            setDataInput([
              {
                key: _status.filter((element) => element.CategoryId === 1)[0]
                  .Name,
                status: _status.filter((element) => element.CategoryId === 1)[0]
                  .Name,
                numberOfTask: (
                  <SetTableData statusId={1} taskLength={numOfInprogress} />
                ),
              },
              {
                key: _status.filter((element) => element.CategoryId === 2)[0]
                  .Name,
                status: _status.filter((element) => element.CategoryId === 2)[0]
                  .Name,
                numberOfTask: (
                  <SetTableData statusId={2} taskLength={numOfDone} />
                ),
              },
            ])
          } else {
            if (numOfInprogress > 0 && numOfDone === 0) {
              setDataInput([
                {
                  key: _status.filter((element) => element.CategoryId === 1)[0]
                    .Name,
                  status: _status.filter(
                    (element) => element.CategoryId === 1,
                  )[0].Name,
                  numberOfTask: (
                    <SetTableData statusId={1} taskLength={numOfInprogress} />
                  ),
                },
              ])
            } else if (numOfDone > 0 && numOfInprogress === 0) {
              setDataInput([
                {
                  key: _status.filter((element) => element.CategoryId === 2)[0]
                    .Name,
                  status: _status.filter(
                    (element) => element.CategoryId === 2,
                  )[0].Name,
                  numberOfTask: (
                    <SetTableData statusId={2} taskLength={numOfDone} />
                  ),
                },
              ])
            } else {
              setDataInput([])
            }
          }
        }
      }
    } catch (error: any) {
      message.error(GENERIC_ERROR)
    }
  }, [])
  useEffect(() => {
    if (task) {
      //setInnerProject(project)
      fetchData(task._id!)
    }
  }, [task])
  return (
    <Modal
      open={openModal}
      title="Cảnh báo"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <Button
            type="primary"
            onClick={() => {
              if (closeFunc) closeFunc()
            }}
          >
            Ok
          </Button>
        </>
      }
      width="25%"
    >
      <Row
        gutter={10}
        align="middle"
        style={{ marginTop: '10px', marginBottom: '10px' }}
      >
        <Col>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size={'2x'}
            color="#FFC107"
          />
        </Col>
        <Col>
          <p style={{ color: 'red', fontSize: '14px' }}>
            Công việc đang có {numOfSubtask} subtask(s) chưa hoàn thành
          </p>
        </Col>
      </Row>
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
    </Modal>
  )
}

export default TaskWarningModal
