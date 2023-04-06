import { DatePicker, DatePickerProps, Space } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import OverDueDate from '../util/OverDueDate'
import { UPDATE_MODE } from '../util/ConfigText'

type DueDateInput = {
  dueDateInput: string
  onChangeValue?: (e: React.ChangeEvent<HTMLInputElement>) => void
  mode?: string
  onOkEvent?: (date: null | (Dayjs | null)) => void
  disabled?: boolean
}

const CustomDatePicker: React.FC<DueDateInput> = ({
  dueDateInput,
  onChangeValue,
  mode,
  onOkEvent,
  disabled,
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

  return (
    <>
      <Space direction="horizontal" style={{ width: '100%' }}>
        <DatePicker
          disabled={disabled}
          className={'datePicker'}
          //open={openDatePicker}
          //onOpenChange={DatePickerStatus}
          placeholder=""
          showTime={{
            format: 'HH:mm:ss',
            defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
          }}
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
