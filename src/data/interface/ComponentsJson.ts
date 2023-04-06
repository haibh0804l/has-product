export interface TaskDetailsProps {
  isNotAuthorize: boolean
  isTaskNameReadOnly: boolean
  isDescriptionReadOnly: boolean
  isSummaryReadOnly: boolean
  isDateReadOnly: boolean
  isStatusReadOnly: boolean
  isPriorityReadOnly: boolean
  isAssigneeReadOnly: boolean
  isReporterReadOnly: boolean
  isCommentReadOnly: boolean
  isDisableUpload: boolean
  isDisableDeleteFile: boolean
  isDisabledScore: boolean
  readOnly: boolean
  canCreatedSubtask: boolean
  isSubtaskReadOnly: boolean
}

export interface ComponentJson {
  _uid: string
  component: string
  properties: TaskDetailsProps
}
