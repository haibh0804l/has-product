import { DatePicker, DatePickerProps, Space, Spin } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import OverDueDate from '../util/OverDueDate'
import {
  CURRENT_TASK_DUE_DATE,
  MAIN_TASK_DUE_DATE,
  SUB_TASK_DUE_DATE,
  UPDATE_MODE,
} from '../util/ConfigText'
import { RangePickerProps } from 'antd/es/date-picker'
import { Tasks } from '../data/database/Tasks'
import { GetAllSubTasks } from '../util/GetAllSubTasks'
import { getCookie } from 'typescript-cookie'

type DueDateInput = {
  dueDateInput: string
  onChangeValue?: (e: React.ChangeEvent<HTMLInputElement>) => void
  mode?: string
  onOkEvent?: (date: null | (Dayjs | null)) => void
  disabled?: boolean
  isSubtask: boolean
  task?: Tasks
}

const CustomDatePicker: React.FC<DueDateInput> = ({
  dueDateInput,
  onChangeValue,
  mode,
  onOkEvent,
  disabled,
  isSubtask,
  task,
}) => {
  const [dueDate, setDueDate] = useState(dueDateInput)

  const onChangeDate = (date: null | (Dayjs | null), dateStrings: string) => {
    if (date) {
      setDueDate(date.toString())
      //change due date goes here
      if (mode === undefined || mode === UPDATE_MODE) {
        //update service goes here
      }
    } else {
      setDueDate('')
    }
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    /* console.log('Task', task)
    console.log('Before')
    console.log('Main ', localStorage.getItem(MAIN_TASK_DUE_DATE))
    console.log('Current ', localStorage.getItem(CURRENT_TASK_DUE_DATE))
    console.log('Sub ', localStorage.getItem(SUB_TASK_DUE_DATE)) */

    /*  console.log('------------------------------------------------------------')
    console.log('After')
    console.log('Main ', localStorage.getItem(MAIN_TASK_DUE_DATE))
    console.log('Current ', localStorage.getItem(CURRENT_TASK_DUE_DATE))
    console.log('Sub ', localStorage.getItem(SUB_TASK_DUE_DATE)) */

    if (task?.TaskName === '') {
      if (
        localStorage.getItem(CURRENT_TASK_DUE_DATE) &&
        localStorage.getItem(CURRENT_TASK_DUE_DATE) !== ''
      ) {
        return (
          current &&
          current >
            dayjs(localStorage.getItem(CURRENT_TASK_DUE_DATE)).endOf('day')
        )
      } else {
        if (
          localStorage.getItem(MAIN_TASK_DUE_DATE) &&
          localStorage.getItem(MAIN_TASK_DUE_DATE) !== ''
        ) {
          return (
            current &&
            current >
              dayjs(localStorage.getItem(MAIN_TASK_DUE_DATE)).endOf('day')
          )
        } else {
          return false
        }
      }
    } else {
      GetAllSubTasks(
        getCookie('user_id')!,
        task,
        task?._id,
        task?.ParentTask as Tasks,
      )
      if (
        localStorage.getItem(MAIN_TASK_DUE_DATE) !== '' &&
        localStorage.getItem(SUB_TASK_DUE_DATE) !== ''
      ) {
        //have main and sub
        return (
          (current &&
            current <
              dayjs(localStorage.getItem(SUB_TASK_DUE_DATE)).endOf('day')) ||
          current > dayjs(localStorage.getItem(MAIN_TASK_DUE_DATE)).endOf('day')
          //false
        )
      } else {
        if (
          localStorage.getItem(MAIN_TASK_DUE_DATE) !== '' &&
          localStorage.getItem(SUB_TASK_DUE_DATE) === ''
        ) {
          return (
            current &&
            current >
              dayjs(localStorage.getItem(MAIN_TASK_DUE_DATE)).endOf('day')
          )
        } else if (
          localStorage.getItem(MAIN_TASK_DUE_DATE) === '' &&
          localStorage.getItem(SUB_TASK_DUE_DATE) !== ''
        ) {
          return (
            current &&
            current <
              dayjs(localStorage.getItem(SUB_TASK_DUE_DATE)).endOf('day')
          )
        } else {
          return false
        }
      }
    }
    //return current && current < dayjs().subtract(1, 'day').endOf('day')
  }

  return (
    <>
      <Space direction="horizontal" style={{ width: '100%' }} title="Due Date">
        <DatePicker
          // disabled={disabled}
          className={'datePicker'}
          //open={openDatePicker}
          //onOpenChange={DatePickerStatus}
          disabledDate={disabledDate}
          placeholder=""
          allowClear={false}
          showTime={{
            format: 'HH:mm:ss',
            defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
          }}
          showNow={false}
          //format={customFormat}
          onChange={onChangeDate}
          onBlur={onChangeValue}
          onOk={onOkEvent}
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
        {dueDate !== '' && dueDate !== null && dueDate !== undefined && (
          <OverDueDate inputDate={new Date(dueDate)} />
        )}
      </Space>
    </>
  )
}

export default CustomDatePicker
