import axios from 'axios'
import { getCookie } from 'typescript-cookie'
import { InputTasks } from '../database/InputTasks'
import { Tasks } from '../database/Tasks'
import { Users } from '../database/Users'
import ServiceHeader from './header'

const GetAllTasks = async (serviceUrl: string) => {
  await axios.get(serviceUrl).then((res) => {
    const data = res.data
    return data
  })
}

const GetTasksById = async (serviceUrl: string, taskId: string) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      { taskId: taskId, populateLevel: 1 },
      {
        headers: ServiceHeader(),
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      //const data = res.data
    })
  return output
}

const GetNotDoneTasksAssignee = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        assigneeid: userId,
        populateLevel: populateLevel,
      },
      {
        headers: ServiceHeader(),
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      //console.log('Assignee result ' + count.toString())
      return output
    })
    .catch(function (error) {
      console.log('Assignee ' + error)
    })
  return output
}

const GetNotDoneTasksAssigneeAxios = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  const repsonse = await axios.post(
    serviceUrl,
    {
      assigneeid: userId,
      populateLevel: populateLevel,
    },
    {
      headers: ServiceHeader(),
    },
  )
  return repsonse
}

const GetNotDoneTasksReporter = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        reporterid: userId,
        populateLevel: populateLevel,
      },
      {
        headers: ServiceHeader(),
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      console.log('Reporter ' + error)
    })
  return output
}

const GetNotDoneTasksReporterAxios = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  const repsonse = await axios.post(
    serviceUrl,
    {
      reporterid: userId,
      populateLevel: populateLevel,
    },
    {
      headers: ServiceHeader(),
    },
  )

  return repsonse
}

export const GetAllTaskBaseOnUserAssigneeAxios = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETALLTASKBASEONUSER!

  const repsonse = await axios.post(
    serviceUrl,
    {
      assigneeid: userId,
      populateLevel: populateLevel,
    },
    {
      headers: ServiceHeader(),
    },
  )

  return repsonse
}

export const GetAllTaskBaseOnUserReporterAxios = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETALLTASKBASEONUSER!

  const repsonse = await axios.post(
    serviceUrl,
    {
      reporterid: userId,
      populateLevel: populateLevel,
    },
    {
      headers: ServiceHeader(),
    },
  )

  return repsonse
}

const InsertTask = async (serviceUrl: string, task: any) => {
  serviceUrl = process.env.REACT_APP_API_TASK_ADDTASKWITHSUBTASK!
  let user: Users = {}
  let output: Tasks = {
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    DueDate: new Date(),
    Assignee: [],
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: user,
    GroupPath: '',
    SummaryReport: '',
  }

  await axios
    .post<Tasks>(serviceUrl, task, {
      headers: ServiceHeader(),
    })
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      console.log(error)
    })
  return output
}

const UpdateTask = async (
  serviceUrl: string,
  taskId: string,
  task: InputTasks,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_UPDATETASK! + '/' + taskId
  let user: Users = {}
  let output: Tasks = {
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    DueDate: new Date(),
    Assignee: [],
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: user,
    GroupPath: '',
    SummaryReport: '',
  }

  let inputTask: InputTasks = JSON.parse(JSON.stringify(task))
  inputTask.userId = getCookie('user_id')
  inputTask.userName = getCookie('user_name')

  await axios
    .post<Tasks>(serviceUrl, JSON.stringify(inputTask), {
      headers: ServiceHeader(),
    })
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      output.errorMessage = error.message
    })
  return output
}

export {
  GetNotDoneTasksAssignee,
  GetNotDoneTasksReporter,
  GetAllTasks,
  InsertTask,
  UpdateTask,
  GetTasksById,
  GetNotDoneTasksAssigneeAxios,
  GetNotDoneTasksReporterAxios,
}
