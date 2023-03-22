import React, { useEffect } from 'react'
import { getCookie } from 'typescript-cookie'
import { Params } from '../../../data/interface/task'
import { useAppSelector, useAppDispatch } from '../../app/hook'
import { fetchUsers } from '../users/usersSlice'

export const UserView = () => {
  const user = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()
  const params: Params = {
    serviceUrl: '/api/users/getReporterOrAssignee',
    type: 'assignee',
    userId: getCookie('user_id')?.toString(),
  }
  useEffect(() => {
    dispatch(fetchUsers(params))
  }, [])
  return (
    <div>
      <h2>List of Users</h2>
      {user.loading && <div>Loading...</div>}
      {!user.loading && user.error ? <div>Error: {user.error}</div> : null}
      {/* {!user.loading && user.users.length ? (
        <ul>
          {user.users.map((element) => (
            <li key={element._id}>{element.Name}</li>
          ))}
        </ul>
      ) : null} */}
    </div>
  )
}
