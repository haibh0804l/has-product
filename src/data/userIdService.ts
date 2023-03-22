import axios from 'axios'
import { Users } from './database/Users'

const GetUserId = async (serviceUrl: string, username: string) => {
  let output: Users = {}
  await axios
    .post(
      serviceUrl,
      {
        username: username,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      output.code = 200
      return output
    })
    .catch((error) => {
      output.message = error.message
      output.code! = error.code
      //console.log(JSON.stringify(Promise.reject(error)))
    })

  return output
}

export { GetUserId }
