import { getCookie } from 'typescript-cookie'
import { ASSIGNEE } from './ConfigText'
import { Users } from '../data/database/Users'
import { SelectorValue } from '../data/interface/SelectorValue'

const StringCut = (input: string) => {
  return input.substring(0, input.indexOf('@'))
}

const DefaultUsers = (): SelectorValue => {
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)

  if (userInfo.Role?.Level === 1) {
    return {
      label: StringCut(userInfo.Group![0].Manager!.UserName!),
      value: userInfo.Group![0].Manager!._id!.toString(),
    }
  } else if (userInfo.Role?.Level === 2) {
    return {
      label: StringCut(userInfo.Group![0].Manager!.UserName!),
      value: userInfo.Group![0].Manager!._id!.toString(),
    }
  } else if (userInfo.Role!.Level >= 3) {
    return {
      label: StringCut(userInfo.UserName!),
      value: userInfo._id!.toString(),
    }
  } else {
    return {
      label: StringCut(userInfo.UserName!),
      value: userInfo._id!.toString(),
    }
  }
}

export default DefaultUsers
