import React from 'react'
import DateFormatter from './DateFormatter'

type InputDate = {
  inputDate: Date
}

const OverDueDate: React.FC<InputDate> = ({ inputDate }) => {
  return (
    <>
      {new Date(inputDate) < new Date() ? (
        <div className="overdue" style={{ float: 'right', width: 'auto' }}>
          <DateFormatter dateString={inputDate} />
        </div>
      ) : (
        <div style={{ float: 'right', width: 'auto' }}>
          <DateFormatter dateString={inputDate} />
        </div>
      )}
    </>
  )
}

export default OverDueDate
