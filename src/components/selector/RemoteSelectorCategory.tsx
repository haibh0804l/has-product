import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { useAppDispatch } from '../../redux/app/hook'
import {
  addPriorityCategory,
  addStatusCategory,
} from '../../redux/features/filter/filterSlice'
import { SelectorValue } from '../../data/interface/SelectorValue'
import { ToLowerCaseNonAccentVietnamese } from '../../util/FormatText'
import { GetCategories } from '../../data/services/categories'
import {
  PriorityCategory,
  StatusCategory,
} from '../../data/database/Categories'
import {
  addPriorityCategoryValue,
  addStatusCategoryValue,
} from '../../redux/features/userInfo/userValueSlice'

interface RemoteSelectorInput {
  type: string
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

async function fetchPriority(
  type: string,
  input: string,
): Promise<SelectorValue[]> {
  if (type === 'Priority') {
    return GetCategories({ type: 'Priority' })
      .then((response) => response.data as PriorityCategory[])
      .then((body) =>
        body
          .filter((element) =>
            ToLowerCaseNonAccentVietnamese(element.Name).includes(
              ToLowerCaseNonAccentVietnamese(input),
            ),
          )
          .map((element) => ({
            label: element.Name,
            value: element._id.toString(),
          })),
      )
  } else {
    return GetCategories({ type: 'Status' })
      .then((response) => response.data as StatusCategory[])
      .then((body) =>
        body
          .filter((element) =>
            ToLowerCaseNonAccentVietnamese(element.Name).includes(
              ToLowerCaseNonAccentVietnamese(input),
            ),
          )
          .map((element) => ({
            label: element.Name,
            value: element._id.toString(),
          })),
      )
  }
}

const RemoteSelectorCategory: React.FC<RemoteSelectorInput> = ({
  type,
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
    if (type === 'Priority') {
      dispatch(addPriorityCategory(value))
      dispatch(addPriorityCategoryValue(newValue))
    } else {
      dispatch(addStatusCategory(value))
      dispatch(addStatusCategoryValue(newValue))
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
      fetchOptions={(e) => fetchPriority(type, e)}
      onChange={(newValue) => {
        onChangeSelector(newValue as SelectorValue[])
      }}
      style={{ width: '100%' }}
    />
  )
}

export default RemoteSelectorCategory
