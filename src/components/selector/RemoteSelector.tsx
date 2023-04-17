import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { GetAllFilter } from '../../data/services/allUsersService'
import { Users } from '../../data/database/Users'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { ASSIGNEE, REPORTER } from '../../util/ConfigText'
import {
  addAssignee,
  addProject,
  addReporter,
} from '../../redux/features/filter/filterSlice'
import { SelectorValue } from '../../data/interface/SelectorValue'
import {
  addAssigneeValue,
  addProjectValue,
  addReporterValue,
} from '../../redux/features/userInfo/userValueSlice'
import { GetUsersByManager } from '../../data/services/projectService'
import { getCookie } from 'typescript-cookie'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'

interface RemoteSelectorInput {
  type: string
  userType: string
  placeHolder: string
  initValue: SelectorValue[]
  disabled?: boolean
  onChangeSelectorFunc?: (e: any) => void
  mode?: 'multiple' | 'tags' | undefined
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
  username: string,
  type: string,
  userType: string,
): Promise<SelectorValue[]> {
  return GetUsersByManager(getCookie('user_id')!, userType, type)
    .then((response) => response.data as Users[])
    .then((body) =>
      body
        .filter((element) =>
          ToLowerCaseNonAccentVietnamese(element.UserName!).includes(
            ToLowerCaseNonAccentVietnamese(username),
          ),
        )
        .map((element) => ({
          label: element.UserName!.substring(0, element.UserName!.indexOf('@')),
          value: element._id!,
        })),
    )
}

const RemoteSelector: React.FC<RemoteSelectorInput> = ({
  type,
  userType,
  placeHolder,
  initValue,
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState<SelectorValue[]>(initValue)

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  const onChangeSelector = (newValue: SelectorValue[]) => {
    const value: string[] = []

    newValue.forEach((element) => {
      value.push(element.value)
    })
    if (type === ASSIGNEE) {
      dispatch(addAssignee(value))
      dispatch(addAssigneeValue(newValue))
    } else if (type === REPORTER) {
      dispatch(addReporterValue(newValue))
      dispatch(addReporter(value))
    }
  }

  return (
    <DebounceSelect
      maxTagCount={'responsive'}
      showSearch
      allowClear
      mode="multiple"
      value={value}
      placeholder={placeHolder}
      fetchOptions={(e) => fetchUserList(e, type, userType)}
      onChange={(newValue) => {
        onChangeSelector(newValue as SelectorValue[])
      }}
      style={{ width: '100%' }}
    />
  )
}

export default RemoteSelector
