import { Space } from 'antd'
import Input from 'antd/es/input/Input'
import { useState } from 'react'
import { Tasks } from '../data/database/Tasks'
import { Users } from '../data/database/Users'
import { IGNORE_STT_DEFAULT } from '../util/ConfigText'
import DropdownProps from './Dropdown'
import IconGroup from './IconGroup'

type SummaryInput = {
  task: Tasks
  assigneeData: Users[]
  reporterData: Users[]
}

const SubTaskSummary: React.FC<SummaryInput> = ({
  task,
  assigneeData,
  reporterData,
}) => {
  const reporters: Users[] = []
  reporters.push(task.Reporter)

  //get assignee value
  const assigneeFilter = assigneeData.filter(
    (element) => element._id === task.Assignee[0]._id,
  )

  //get reporter value
  const reporterFilter = reporterData.filter(
    (element) => element._id === task.Reporter._id,
  )

  const [editTaskName, setEditTaskName] = useState(false)

  return (
    <Space direction="horizontal">
      <DropdownProps
        type="Status"
        text={task.Status ? task.Status : ''}
        button={true}
        taskId={task._id}
        id={'details'}
        ignoreStt={IGNORE_STT_DEFAULT()}
      />
      {editTaskName === false ? (
        <p onClick={() => setEditTaskName(true)}>{task.TaskName}</p>
      ) : (
        <Input value={task.TaskName} onBlur={() => setEditTaskName(false)} />
      )}
      <DropdownProps
        type={'Priority'}
        text={task.Priority ? task.Priority : ''}
        id={'details'}
        //onClickMenu={handleMenuClick}
      />
      <IconGroup inputList={assigneeFilter} />
      <IconGroup inputList={reporterFilter} />
      {/* <CustomDatePicker
        dueDateInput={task.DueDate.toString()}
        //onChangeValue={OnChangeDateTime}
      /> */}
    </Space>
  )
}

export default SubTaskSummary
