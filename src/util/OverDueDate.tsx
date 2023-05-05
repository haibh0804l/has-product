import React from 'react'
import { Tasks } from '../data/database/Tasks'
import DateFormatter from './DateFormatter'

type InputDate = {
  inputDate: Date
}

const OverDueDate: React.FC<InputDate> = ({ inputDate }) => {
  return (
    <>
      {new Date(inputDate) < new Date() ? (
        <div className="overdue">
          <DateFormatter dateString={inputDate} />
        </div>
      ) : (
        <div>
          <DateFormatter dateString={inputDate} />
        </div>
      )}
    </>
  )
}

export default OverDueDate
