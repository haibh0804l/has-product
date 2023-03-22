import axios from 'axios'
import {
  CommentByTaskIdRepsonse,
  CommentRequest,
  CommentResponse,
} from './database/Comment'

export const AddComment = async (cmtRep: CommentRequest) => {
  const serviceUrl = process.env.REACT_APP_API_COMMENT_ADDCOMMENT!
  const response = await axios.post(serviceUrl, JSON.stringify(cmtRep), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data as CommentResponse
}

export const DeleteComment = async (taskId: string, commentId: string) => {
  const serviceUrl = process.env.REACT_APP_API_COMMENT_DELETECOMMENT!
  const response = await axios.post(
    serviceUrl,
    {
      taskId: taskId,
      commentId: commentId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data as string
}

export const UpdateComment = async (commentId: string, comment: string) => {
  const serviceUrl =
    process.env.REACT_APP_API_COMMENT_UPDATECOMMENT! + commentId
  const response = await axios.put(
    serviceUrl,
    {
      Comment: comment,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data as CommentResponse
}

export const GetCommentByTaskId = async (taskId: string) => {
  const serviceUrl = process.env.REACT_APP_API_COMMENT_GETCOMMENTBYTASKID!
  const response = await axios.post(
    serviceUrl,
    {
      taskId: taskId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response
}
