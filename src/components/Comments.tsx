import { Button, Col, Input, Row, Space, Spin } from 'antd'
import ObjectID from 'bson-objectid'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getCookie } from 'typescript-cookie'
import { CommentRequest, CommentResponse } from '../data/database/Comment'
import { Users } from '../data/database/Users'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import DateFormatter from '../util/DateFormatter'
import UserIcon from './UserIcon'

import { SocketContext } from '../context'
import { SendOutlined } from '@ant-design/icons'
import { fetchComment } from '../redux/features/comment/commentSlice'

interface CompInput {
  user: Users
  comment: string
  createdDate: Date
}

interface CommnentsInput {
  taskId: string
}

const Comp: React.FC<CompInput> = ({ user, comment, createdDate }) => {
  return (
    <Row gutter={2}>
      <Col span={2}>
        <UserIcon
          username={user.UserName}
          userColor={user.Color}
          tooltipName={user.UserName}
          userInfo={user}
        />
      </Col>
      <Col
        span={22}
        style={{
          width: '100%',
          borderColor: '#FACC15',
          backgroundColor: '#F3F4F6',
        }}
      >
        <Space
          direction="horizontal"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ float: 'left', margin: '7px 0 7px 7px' }}>
            {user.FirstName + ' ' + user.LastName}
          </p>
          <div
            style={{
              float: 'right',
              margin: '7px 7px 7px 0',
            }}
          >
            <DateFormatter dateString={createdDate} />
          </div>
        </Space>
        <Row>
          <p
            style={{
              float: 'left',
              wordBreak: 'normal',
              maxWidth: '500px',
              margin: '7px 0px 0px 7px',
            }}
          >
            {comment}
          </p>
        </Row>
      </Col>
    </Row>
  )
}

const Comments: React.FC<CommnentsInput> = ({ taskId }) => {
  /* const [dummyInput, setDummyInput] = useState<CommentResponse[]>(
    JSON.parse(
      '[{\r\n"_id":"64095a2b073b9afdbb4a6665",\r\n"Comment":"Testcomment64095a2a1f43125f74f01cf4",\r\n"User":{\r\n"_id":"63bbf13e2facab213077dc03",\r\n"UserName":"minhdq@bpm.lab",\r\n"Name":"minhdq",\r\n"Role":"63bf862a1784ec2c458d1657",\r\n"Department":"R&D",\r\n"__v":0,\r\n"Color":"#49768F",\r\n"FirstName":"Minh",\r\n"Group":[\r\n"63c5050b2b3d7578b6388560"\r\n],\r\n"LastName":"Dinh"\r\n},\r\n"CreatedDate":"2023-03-09T04:01:46.216Z",\r\n"Attachment":[],\r\n"__v":0\r\n},\r\n{\r\n"_id":"64095a70073b9afdbb4a6668",\r\n"Comment":"Testcomment64095a6f1f43125f74f01cff",\r\n"User":{\r\n"_id":"63bbf13e2facab213077dc03",\r\n"UserName":"minhdq@bpm.lab",\r\n"Name":"minhdq",\r\n"Role":"63bf862a1784ec2c458d1657",\r\n"Department":"R&D",\r\n"__v":0,\r\n"Color":"#49768F",\r\n"FirstName":"Minh",\r\n"Group":[\r\n"63c5050b2b3d7578b6388560"\r\n],\r\n"LastName":"Dinh"\r\n},\r\n"CreatedDate":"2023-03-09T04:02:55.422Z",\r\n"Attachment":[],\r\n"__v":0\r\n},\r\n{\r\n"_id":"64095add073b9afdbb4a666a",\r\n"Comment":"Testcomment64095add1f43125f74f01d0a",\r\n"User":{\r\n"_id":"63bbf13e2facab213077dc03",\r\n"UserName":"minhdq@bpm.lab",\r\n"Name":"minhdq",\r\n"Role":"63bf862a1784ec2c458d1657",\r\n"Department":"R&D",\r\n"__v":0,\r\n"Color":"#49768F",\r\n"FirstName":"Minh",\r\n"Group":[\r\n"63c5050b2b3d7578b6388560"\r\n],\r\n"LastName":"Dinh"\r\n},\r\n"CreatedDate":"2023-03-09T04:04:45.068Z",\r\n"Attachment":[],\r\n"__v":0\r\n}]',
    ),
  ) */
  const [dummyInput, setDummyInput] = useState<CommentResponse[]>([])
  const socket = useContext(SocketContext)
  const user = useAppSelector((state) => state.userInfo.user)
  const [commentInput, setCommentInput] = useState('')
  const commentsResult = useAppSelector((state) => state.comment)
  const dispatch = useAppDispatch()
  const refForScroll = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchComment(taskId))
  }, [])

  useEffect(() => {
    socket.on('addCommentData', () => {
      dispatch(fetchComment(taskId))
    })

    return () => {
      socket.off('addCommentData')
    }
  }, [])

  useEffect(() => {
    if (
      !commentsResult.loading &&
      commentsResult.comment.length !== undefined
    ) {
      if (commentsResult.comment.length === 0) {
      } else {
        setDummyInput(commentsResult.comment[0].Comment)
      }
      refForScroll.current!.scrollIntoView({ behavior: 'smooth' })
    }
  }, [commentsResult.loading, commentsResult.comment.length])

  /*  useEffect(() => {
    setDummyInput(userComments)
    refForScroll.current!.scrollIntoView({ behavior: 'smooth' })
  }, [userComments]) */

  useEffect(() => {
    refForScroll.current!.scrollIntoView({ behavior: 'smooth' })
  })

  const AddComp = () => {
    if (commentInput !== '') {
      const comment: CommentRequest = {
        taskId: taskId,
        userId: getCookie('user_id')!,
        comment: commentInput,
        createdDate: new Date(),
      }
      socket.emit('addComment', comment)

      const userInfo: Users = JSON.parse(getCookie('userInfo')!)
      const newId = ObjectID(new Date().getTime()).toHexString()
      setDummyInput([
        ...dummyInput,
        {
          _id: newId,
          Comment: commentInput,
          User: userInfo,
          CreatedDate: new Date(),
          Attachment: [],
          __v: 0,
        },
      ])
      setCommentInput('')
    }
  }

  return (
    <div>
      <Space
        direction="vertical"
        style={{
          width: '100%',
          height: '390px',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {user ? (
          dummyInput.map((element) => (
            <Comp
              user={element.User!}
              comment={element.Comment!}
              createdDate={element.CreatedDate!}
              key={element._id}
            />
          ))
        ) : (
          <Spin />
        )}
        <div ref={refForScroll} />
      </Space>
      <div
        style={{
          height: '30px',
        }}
      >
        <Input
          style={{ float: 'left', width: '91%' }}
          placeholder="Comment"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onPressEnter={() => {
            AddComp()
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{ float: 'right', width: '8%', marginLeft: '1%' }}
          onClick={() => AddComp()}
        />
      </div>
    </div>
  )
}

export default Comments
