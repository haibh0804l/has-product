import React, { useState } from 'react'
import { Space, Tooltip, Typography } from 'antd'
import '../assets/css/paragraph.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { Tasks } from '../data/database/Tasks'
interface Name {
  type?: string
  name?: string
  task: Tasks
}

const { Paragraph } = Typography

const _styleTask: React.CSSProperties = {
  margin: '0',
  maxWidth: '30vw',
}

const _styleProject: React.CSSProperties = {
  margin: '0',
  //width: '20vw',
}

const ParagraphExample: React.FC<Name> = ({ type, name, task }) => {
  const [ellipsis, setEllipsis] = useState(true)
  const [expand, setExpand] = useState(false)
  const [counter, setCounter] = useState(0)

  const TypoExpand = () => {
    setExpand(true)
    setCounter(!expand ? counter + 0 : counter + 1)
    return null
  }
  const TypoClose = () => {
    setExpand(false)
    setCounter(!expand ? counter + 0 : counter + 1)
    return null
  }

  return (
    <>
      <div key={counter}>
        {type ? (
          <Space direction="horizontal">
            <Paragraph
              ellipsis={
                ellipsis
                  ? {
                      rows: 1,
                      expandable: false,
                      symbol: '...',
                      onExpand: () => TypoExpand(),
                    }
                  : false
              }
              style={_styleTask}
            >
              <Tooltip title={name}>{name}</Tooltip>
            </Paragraph>

            {type && task && task.Subtask && task.Subtask?.length ? (
              <Tooltip title={task.Subtask?.length + ' subtask(s)'}>
                <FontAwesomeIcon
                  icon={faDiagramProject}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginLeft: '10px' }}
                />
              </Tooltip>
            ) : null}
          </Space>
        ) : (
          <Space direction="horizontal">
            <Paragraph
              ellipsis={
                ellipsis
                  ? {
                      rows: 1,
                      expandable: false,
                      symbol: '...',
                      onExpand: () => TypoExpand(),
                    }
                  : false
              }
              style={_styleProject}
            >
              <Tooltip title={name}>{name}</Tooltip>
            </Paragraph>
          </Space>
        )}
      </div>
      {expand === true && <a onClick={TypoClose}>Close</a>}
    </>
  )
}

export default ParagraphExample
