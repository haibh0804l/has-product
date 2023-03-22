import { Space, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchHistory } from '../redux/features/history/historySlice'
import DateFormatter from '../util/DateFormatter'
import '../assets/css/date.css'

interface HistoryComponentInput {
  collection: string
  documentId: string
}

interface CompInput {
  action: string
  createdDate: Date
}

const { Text } = Typography

const Comp: React.FC<CompInput> = ({ action, createdDate }) => {
  return (
    <div>
      <p style={{ float: 'left', width: '80%' }}>{action}</p>
      <p style={{ float: 'right', width: 'auto' }}>
        <DateFormatter dateString={createdDate} />
      </p>
    </div>
  )
}

const HistoryComponent: React.FC<HistoryComponentInput> = ({
  collection,
  documentId,
}) => {
  const history = useAppSelector((state) => state.history)
  const dispatch = useAppDispatch()
  const params = {
    collection: collection,
    documentId: documentId,
  }

  useEffect(() => {
    dispatch(fetchHistory(params))
  }, [])

  return (
    <div>
      {!history.loading && history.history.length !== undefined ? (
        <Space
          direction="vertical"
          style={{
            width: '100%',
            height: '350px',
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}
        >
          {history.history.map((element) => (
            <Comp
              action={element.Description!}
              createdDate={element.CreatedDate!}
              key={element._id}
            />
          ))}
        </Space>
      ) : (
        <p>No history to show</p>
      )}
    </div>
  )
}

export default HistoryComponent
