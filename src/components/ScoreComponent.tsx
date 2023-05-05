import { faFrown, faSmile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Col,
  Divider,
  InputNumber,
  Modal,
  notification,
  Row,
  Slider,
  Space,
  Spin,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ModifierKey, useEffect, useState } from 'react'
import { Tasks } from '../data/database/Tasks'
import UserIcon from './UserIcon'
import '../assets/css/layout.css'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/services/tasksService'
import {
  BAD_SCORE_TEXT,
  BIG_SCORE_TEXT,
  GOOD_SCORE_TEXT,
  MAX_SCORE,
  MIN_SCORE,
  UPDATE_FAIL,
  ZERO_SCORE_TEXT,
} from '../util/ConfigText'
import DateFormatter from '../util/DateFormatter'
interface ScoreCompParam {
  task: Tasks
  readOnly: boolean
  openModal: boolean
  closeFunc: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  updateFunc?: (e: any) => void
  newStatus?: string
  defaultScore?: number
}

const ScoreComp: React.FC<ScoreCompParam> = ({
  task,
  readOnly,
  openModal,
  closeFunc,
  updateFunc,
  newStatus,
  defaultScore,
}) => {
  const score = defaultScore ? defaultScore : 0
  const [inputValue, setInputValue] = useState(score)
  const [commentValue, setCommentValue] = useState(
    task.ScoreComment ? task.ScoreComment : 'Every effort counts',
  )
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const updateScore = async (e: any) => {
    setLoading(true)
    const inputTask: InputTasks = {
      StatusCategory: newStatus!,
      Score: inputValue,
      ScoreComment: commentValue,
      ScoreModifiedDate: new Date(),
      CloseDate: new Date(),
    }

    const updatedValue = await UpdateTask('', task._id!, inputTask)
    if (updatedValue.errorMessage === undefined) {
      //success
      //Modal.destroyAll()
      if (updateFunc) updateFunc(e)
      if (closeFunc) closeFunc(e)
    } else {
      //fail
      notification.open({
        message: 'Notification',
        description: UPDATE_FAIL,
        duration: 2,
        onClick: () => {
          //console.log('Notification Clicked!')
        },
      })
    }
    setLoading(false)
  }

  const OnCancel = () => {
    Modal.destroyAll()
  }

  const onChange = (newValue: number) => {
    setInputValue(newValue)
    if (newValue === 0) {
      setCommentValue(ZERO_SCORE_TEXT)
    } else if (newValue < 5 && newValue > 1) {
      setCommentValue(BAD_SCORE_TEXT)
    } else if (newValue < 10 && newValue > 6) {
      setCommentValue(GOOD_SCORE_TEXT)
    } else if (newValue > 11) {
      setCommentValue(BIG_SCORE_TEXT)
    }
  }
  return (
    <>
      <Modal
        title="Review and Mark"
        open={openModal}
        onCancel={closeFunc}
        width="30%"
        footer={[]}
        keyboard={false}
      >
        <Divider />
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <p style={{ float: 'left', width: 'auto' }}>Date Created</p>
            <p style={{ float: 'right', width: 'auto' }}>
              <DateFormatter dateString={task.CreateDate} />
            </p>
          </div>
          <div>
            <p style={{ float: 'left', width: 'auto' }}>Date Completed</p>
            <p style={{ float: 'right', width: 'auto' }}>
              <DateFormatter
                dateString={task.DoneDate ? task.DoneDate : new Date()}
              />
            </p>
          </div>
          <UserIcon
            username={task.Assignee[0].Name}
            userColor={task.Assignee[0].Color}
            tooltipName={task.Assignee[0].UserName}
            userInfo={task.Assignee[0]}
          />
          {readOnly === false ? (
            <Row>
              <Col span={2}>
                <FontAwesomeIcon icon={faFrown} size="2x" color="grey" />
              </Col>
              <Col span={20}>
                <Slider
                  min={MIN_SCORE}
                  max={MAX_SCORE}
                  onChange={onChange}
                  //style={{ width: '23.3vw' }}
                  value={typeof inputValue === 'number' ? inputValue : 0}
                />
              </Col>
              <Col span={2} style={{ flex: '1' }}>
                <center>
                  <FontAwesomeIcon icon={faSmile} size="2x" color="#FFC107" />
                </center>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col span={6}>
              <h3>Score</h3>
            </Col>
            <Col span={18}>
              <center>
                <h3>Remark</h3>
              </center>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              {/* <h1>{inputValue}</h1> */}
              <InputNumber
                min={MIN_SCORE}
                max={MAX_SCORE}
                size="large"
                //style={{ fontSize: '40px', height: '100px' }}
                value={inputValue}
                onChange={(e) => onChange(e!)}
                disabled={readOnly}
              />
            </Col>
            <Col span={18}>
              <TextArea
                value={commentValue}
                style={{ width: '100%', height: '100px' }}
                disabled={readOnly}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              {err !== '' && <div className="overdue">{err}</div>}
            </Col>
          </Row>
          {readOnly === false ? (
            <center>
              <Button
                key="submitBtn"
                type="default"
                style={{ marginRight: '10px' }}
                onClick={(e: any) => {
                  setInputValue(task.Score ? task.Score : 0)
                  closeFunc(e)
                  //OnCancel()
                }}
              >
                Hủy
              </Button>
              {loading === false ? (
                <Button
                  key="submitBtn"
                  type="primary"
                  onClick={(e: any) => {
                    if (commentValue === '') {
                      setErr('Please type your reason for changing the score')
                    } else {
                      setErr('')
                      updateScore(e)
                      //console.log('New status ' + newStatus)

                      //setEditScore(false)
                    }
                  }}
                >
                  Xác nhận
                </Button>
              ) : (
                <Spin />
              )}
            </center>
          ) : null}
        </Space>
      </Modal>
    </>
  )
}

export default ScoreComp
