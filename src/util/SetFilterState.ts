import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import {
  addAssignee,
  addCompleted,
  addProject,
  addReporter,
  addStatus,
  addTaskName,
} from '../redux/features/filter/filterSlice'
import {
  ASSIGNEE,
  CLOSEDTASK,
  PROJECT,
  REPORTER,
  STATUS,
  TASKNAME,
} from './ConfigText'

export const SetFilterState = (tabs: string, type: string, value: any) => {
  const filter = useAppSelector((state) => state.filter.filter)
  const dispatch = useAppDispatch()
  if (tabs === '1') {
  } else if (tabs === '2') {
  } else {
    if (type === PROJECT) {
      dispatch(addProject(value))
    } else if (type === ASSIGNEE) {
      dispatch(addAssignee(value))
    } else if (type === REPORTER) {
      dispatch(addReporter(value))
    } else if (type === CLOSEDTASK) {
      dispatch(addCompleted(value))
    } else if (type === TASKNAME) {
      dispatch(addTaskName(value))
    } else {
      dispatch(addStatus(value))
    }
  }
  console.log('Filter now ' + JSON.stringify(filter))
}
