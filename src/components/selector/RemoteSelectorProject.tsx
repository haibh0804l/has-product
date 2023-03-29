import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { ASSIGNEE, MANAGER, REPORTER } from '../../util/ConfigText'
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
import { GetProject } from '../../data/projectService'
import { getCookie } from 'typescript-cookie'
import { ProjectRepsonse } from '../../data/database/Project'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'

interface RemoteSelectorInput {
  initValue: SelectorValue[]
  placeHolder: string
  disabled?: boolean
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
async function fetchUserList(input: string): Promise<SelectorValue[]> {
  return GetProject(getCookie('user_id')!, MANAGER)
    .then((response) => response.data as ProjectRepsonse[])
    .then((body) =>
      body
        .filter((element) =>
          ToLowerCaseNonAccentVietnamese(element.ProjectName!).includes(
            ToLowerCaseNonAccentVietnamese(input),
          ),
        )
        .map((element) => ({
          label: element.ProjectName,
          value: element._id!,
        })),
    )
}

const RemoteSelectorProject: React.FC<RemoteSelectorInput> = ({
  initValue,
  placeHolder,
}) => {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState<SelectorValue[]>(initValue)

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  const onChangeSelector = (newValue: SelectorValue[]) => {
    const _value: string[] = []

    newValue.forEach((element) => {
      _value.push(element.value)
    })
    setValue(newValue)
    dispatch(addProject(_value))
    dispatch(addProjectValue(newValue))
  }

  return (
    <DebounceSelect
      maxTagCount={'responsive'}
      showSearch
      allowClear
      showArrow
      mode="multiple"
      value={value}
      placeholder={placeHolder}
      fetchOptions={(e) => fetchUserList(e)}
      onChange={(newValue) => {
        onChangeSelector(newValue as SelectorValue[])
      }}
      style={{ width: '100%' }}
    />
  )
}

export default RemoteSelectorProject
