import { TaskDetailsProps } from '../data/interface/ComponentsJson'

const Auth = (
  userId: string,
  assigneeId: string,
  reporterId: string,
  manager: string[],
) => {
  //console.log('Managers ' + JSON.stringify(manager) + ' User ' + userId)
  let props: TaskDetailsProps = {
    isNotAuthorize: false,
    isTaskNameReadOnly: false,
    isDescriptionReadOnly: false,
    isSummaryReadOnly: false,
    isDateReadOnly: false,
    isStatusReadOnly: false,
    isPriorityReadOnly: false,
    isAssigneeReadOnly: false,
    isReporterReadOnly: false,
    isCommentReadOnly: false,
    isDisableUpload: false,
    isDisableDeleteFile: false,
    isDisabledScore: false,
    readOnly: false,
    canCreatedSubtask: true,
    isSubtaskReadOnly: false,
  }
  //reporter
  if (userId === reporterId) {
    props = {
      isNotAuthorize: false,
      isTaskNameReadOnly: false,
      isDescriptionReadOnly: false,
      isSummaryReadOnly: false,
      isDateReadOnly: false,
      isStatusReadOnly: false,
      isPriorityReadOnly: false,
      isAssigneeReadOnly: false,
      isReporterReadOnly: false,
      isCommentReadOnly: false,
      isDisableUpload: false,
      isDisableDeleteFile: false,
      isDisabledScore: false,
      readOnly: false,
      canCreatedSubtask: true,
      isSubtaskReadOnly: false,
    }
  } else if (userId === assigneeId) {
    props = {
      isNotAuthorize: false,
      isTaskNameReadOnly: false,
      isDescriptionReadOnly: false,
      isSummaryReadOnly: false,
      isDateReadOnly: false,
      isStatusReadOnly: false,
      isPriorityReadOnly: false,
      isAssigneeReadOnly: false,
      isReporterReadOnly: false,
      isCommentReadOnly: false,
      isDisableUpload: false,
      isDisableDeleteFile: false,
      isDisabledScore: false,
      readOnly: true,
      canCreatedSubtask: true,
      isSubtaskReadOnly: false,
    }
  } else if (
    manager.length > 0 &&
    manager.filter((element) => element === userId).length > 0
  ) {
    props = {
      isNotAuthorize: false,
      isTaskNameReadOnly: true,
      isDescriptionReadOnly: true,
      isSummaryReadOnly: true,
      isDateReadOnly: true,
      isStatusReadOnly: true,
      isPriorityReadOnly: true,
      isAssigneeReadOnly: true,
      isReporterReadOnly: true,
      isCommentReadOnly: false,
      isDisableUpload: true,
      isDisableDeleteFile: true,
      isDisabledScore: true,
      readOnly: true,
      canCreatedSubtask: false,
      isSubtaskReadOnly: true,
    }
  } else {
    props = {
      isNotAuthorize: true,
      isTaskNameReadOnly: true,
      isDescriptionReadOnly: true,
      isSummaryReadOnly: true,
      isDateReadOnly: true,
      isStatusReadOnly: true,
      isPriorityReadOnly: true,
      isAssigneeReadOnly: true,
      isReporterReadOnly: true,
      isCommentReadOnly: false,
      isDisableUpload: true,
      isDisableDeleteFile: true,
      isDisabledScore: true,
      readOnly: true,
      canCreatedSubtask: false,
      isSubtaskReadOnly: true,
    }
  }
  return props
}

export default Auth
