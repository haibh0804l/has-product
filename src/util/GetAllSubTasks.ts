import { Tasks } from '../data/database/Tasks'
import { GetTasksById } from '../data/services/tasksService'
import {
  SUB_TASK_DUE_DATE,
  CURRENT_TASK_DUE_DATE,
  MAIN_TASK_DUE_DATE,
} from './ConfigText'

export const GetAllSubTasks = async (
  userId: string,
  inputTask?: Tasks,
  taskId?: string,
  mainTask?: Tasks,
) => {
  let currentTasks: Tasks[] = []
  if (!inputTask) {
    try {
      const response = await GetTasksById('', taskId!, userId)
      currentTasks = response
    } catch {}
  } else {
    currentTasks.push(inputTask)
  }

  //MAIN_TASK
  if (mainTask) {
    localStorage.setItem(
      MAIN_TASK_DUE_DATE,
      mainTask.DueDate ? mainTask.DueDate.toString() : '',
    )
  } else {
    localStorage.setItem(MAIN_TASK_DUE_DATE, '')
  }
  //CURRENT_TASK
  localStorage.setItem(
    CURRENT_TASK_DUE_DATE,
    currentTasks[0].DueDate ? currentTasks[0].DueDate.toString() : '',
  )

  //SUB_TASK
  if (currentTasks[0].Subtask && currentTasks[0].Subtask.length > 0) {
    const reduceTask: Tasks = currentTasks[0].Subtask.reduce((a, b) => {
      if (a.DueDate && b.DueDate) {
        return new Date(a.DueDate) > new Date(b.DueDate) ? a : b
      } else {
        if (a.DueDate && !b.DueDate) {
          return a
        } else if (!a.DueDate && b.DueDate) {
          return b
        } else {
          return ''
        }
      }
    })
    if (reduceTask.DueDate) {
      localStorage.setItem(SUB_TASK_DUE_DATE, reduceTask.DueDate.toString())
    } else {
      localStorage.setItem(SUB_TASK_DUE_DATE, '')
    }
  } else {
    localStorage.setItem(SUB_TASK_DUE_DATE, '')
  }
}
