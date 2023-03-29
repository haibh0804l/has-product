import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Empty, Select, Space, Spin } from 'antd'
import type { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { GetAllFilter } from '../../data/allUsersService'
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
import { GetUsersByManager } from '../../data/projectService'
import { getCookie } from 'typescript-cookie'
import { responsesAreSame } from 'workbox-broadcast-update'
import UserIcon from '../UserIcon'

interface RemoteSelectorInput {
  type: string
  placeHolder: string
  onChangeSelectorFunc?: (e: any) => void
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
): Promise<SelectorValue[]> {
  /* return GetAllFilter(type, username)
    .then((response) => response.data as Users[])
    .then((body) =>
      body
        .filter((element) => element.UserName?.includes(username))
        .map((element) => ({
          label: element.UserName!,
          value: element._id!,
        })),
    ) */
  const repsonse = await GetAllFilter(type)
  const reponseData = repsonse as Users[]
  if (reponseData.length === 0) {
    return [
      {
        label: <Empty />,
        value: '',
      },
    ]
  } else {
    return (
      reponseData
        //.filter((element) => element.UserName?.includes(username))
        .map((element) => ({
          label: (
            <Space direction="horizontal" size="small" align="center">
              <UserIcon
                username={element.Name}
                userColor={element.Color}
                tooltipName={element.UserName}
                userInfo={element}
              />
              <h4>{element.Name}</h4>
            </Space>
          ),
          value: element._id!,
        }))
    )
  }
}

const UserSelector: React.FC<RemoteSelectorInput> = ({
  type,
  placeHolder,
  onChangeSelectorFunc,
}) => {
  const [value, setValue] = useState<SelectorValue[]>()

  return (
    <DebounceSelect
      showSearch
      allowClear
      mode="multiple"
      value={value}
      placeholder={placeHolder}
      fetchOptions={(e) => fetchUserList(e, type)}
      onChange={(newValue) => {
        setValue(newValue as SelectorValue[])
        if (onChangeSelectorFunc) onChangeSelectorFunc(newValue)
      }}
      style={{ width: '100%' }}
    />
  )
}

export default UserSelector
