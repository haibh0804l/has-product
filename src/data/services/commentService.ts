import axios from 'axios'
import { CommentRequest, CommentResponse } from '../database/Comment'
import ServiceHeader from './header'

export const AddComment = async (cmtRep: CommentRequest) => {
  const serviceUrl = process.env.REACT_APP_API_COMMENT_ADDCOMMENT!
  const response = await axios.post(serviceUrl, JSON.stringify(cmtRep), {
    headers: ServiceHeader(),
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
      headers: ServiceHeader(),
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
      headers: ServiceHeader(),
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
      headers: ServiceHeader(),
    },
  )
  return response
}
