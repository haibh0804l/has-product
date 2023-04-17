import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { GetUserByType } from '../../data/services/allUsersService'
import { Users } from '../../data/database/Users'
import { SelectorValue } from '../../data/interface/SelectorValue'
import {
  GetProject,
  GetUsersByProject,
} from '../../data/services/projectService'
import { getCookie } from 'typescript-cookie'
import { ProjectRepsonse } from '../../data/database/Project'
import { ASSIGNEE, PROJECT } from '../../util/ConfigText'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'

interface RemoteSelectorInput {
  type: string
  placeHolder: string
  initValue?: SelectorValue
  disabled?: boolean
  onChangeSelectorFunc?: (e: any) => void
  mode?: 'multiple' | 'tags' | undefined
  isProjectFixed: boolean
  projectId?: string
  isProjectChange?: boolean
  projectStatus?: string
}

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
}

function DebounceSelect<
  ValueType extends {
    key?: string
    label: React.ReactNode
    value: string | number
  } = any,
>({
  fetchOptions,
  debounceTimeout = 200,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<ValueType[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      labelInValue
      filterOption={false}
      onFocus={() => debounceFetcher('')}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}

// Usage of DebounceSelect
async function fetchUserList(
  searchValue: string,
  type: string,
  isProjectFixed: boolean,
  projectId?: string,
  projectStatus?: string,
): Promise<SelectorValue[]> {
  if (type === PROJECT) {
    return GetProject(getCookie('user_id')!, 'All', projectStatus)
      .then((response) => response.data as ProjectRepsonse[])
      .then((body) =>
        body
          .filter((element) =>
            ToLowerCaseNonAccentVietnamese(element.ProjectName!).includes(
              ToLowerCaseNonAccentVietnamese(searchValue),
            ),
          )
          .map((element) => ({
            label: element.ProjectName,
            value: element._id!,
          })),
      )
  } else {
    if (type === ASSIGNEE) {
      if (!isProjectFixed) {
        if (!projectId) {
          return GetUserByType('', 'assignee', getCookie('user_id')?.toString())
            .then((response) => response)
            .then((body) =>
              body
                .filter((element) =>
                  ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                    ToLowerCaseNonAccentVietnamese(searchValue),
                  ),
                )
                .map((element) => ({
                  label: element.UserName!.substring(
                    0,
                    element.UserName!.indexOf('@'),
                  ),
                  value: element._id!,
                })),
            )
        } else {
          return GetUsersByProject(projectId!, type)
            .then((response) => response.data as Users[])
            .then((body) =>
              body
                .filter((element) =>
                  ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                    ToLowerCaseNonAccentVietnamese(searchValue),
                  ),
                )
                .map((element) => ({
                  label: element.UserName!.substring(
                    0,
                    element.UserName!.indexOf('@'),
                  ),
                  value: element._id!,
                })),
            )
        }
      } else {
        return GetUsersByProject(projectId!, type)
          .then((response) => response.data as Users[])
          .then((body) =>
            body
              .filter((element) =>
                ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                  ToLowerCaseNonAccentVietnamese(searchValue),
                ),
              )
              .map((element) => ({
                label: element.UserName!.substring(
                  0,
                  element.UserName!.indexOf('@'),
                ),
                value: element._id!,
              })),
          )
      }
    } else {
      if (!isProjectFixed) {
        if (!projectId) {
          return GetUserByType('', 'reporter', getCookie('user_id')?.toString())
            .then((response) => response)
            .then((body) =>
              body
                .filter((element) =>
                  ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                    ToLowerCaseNonAccentVietnamese(searchValue),
                  ),
                )
                .map((element) => ({
                  label: element.UserName!.substring(
                    0,
                    element.UserName!.indexOf('@'),
                  ),
                  value: element._id!,
                })),
            )
        } else {
          return GetUsersByProject(projectId!, type)
            .then((response) => response.data as Users[])
            .then((body) =>
              body
                .filter((element) =>
                  ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                    ToLowerCaseNonAccentVietnamese(searchValue),
                  ),
                )
                .map((element) => ({
                  label: element.UserName!.substring(
                    0,
                    element.UserName!.indexOf('@'),
                  ),
                  value: element._id!,
                })),
            )
        }
      } else {
        return GetUsersByProject(projectId!, type)
          .then((response) => response.data as Users[])
          .then((body) =>
            body
              .filter((element) =>
                ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
                  ToLowerCaseNonAccentVietnamese(searchValue),
                ),
              )
              .map((element) => ({
                label: element.UserName!.substring(
                  0,
                  element.UserName!.indexOf('@'),
                ),
                value: element._id!,
              })),
          )
      }
    }
  }
}

const RemoteSelectorSingle: React.FC<RemoteSelectorInput> = ({
  type,
  placeHolder,
  initValue,
  disabled,
  onChangeSelectorFunc,
  isProjectFixed,
  projectId,
  isProjectChange,
  projectStatus,
}) => {
  const [value, setValue] = useState<SelectorValue>()

  useEffect(() => {
    if (initValue) {
      setValue(initValue)
    }
  }, [initValue])

  useEffect(() => {
    if (type !== PROJECT) {
      setValue(undefined)
    }
  }, [isProjectChange])

  const onChangeSelector = (newValue: SelectorValue) => {
    setValue(newValue)
    if (onChangeSelectorFunc) onChangeSelectorFunc(newValue)
  }

  return (
    <DebounceSelect
      showSearch
      allowClear
      value={value}
      placeholder={placeHolder}
      fetchOptions={(e) =>
        fetchUserList(e, type, isProjectFixed, projectId, projectStatus)
      }
      onChange={(newValue) => {
        onChangeSelector(newValue as SelectorValue)
      }}
      onClear={() => {
        if (onChangeSelectorFunc) onChangeSelectorFunc('')
      }}
      style={{ width: '100%' }}
      disabled={disabled ? disabled : false}
    />
  )
}

export default RemoteSelectorSingle
