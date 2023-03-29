import React, { useEffect, useState } from 'react'
import type { SelectProps } from 'antd'
import { Select, Space } from 'antd'
import { statusData } from '../../data/statusData'
import { IGNORE_STT_DEFAULT, STATUS } from '../../util/ConfigText'
import { SetFilterState } from '../../util/SetFilterState'
import { useAppDispatch } from '../../redux/app/hook'
import { addStatus } from '../../redux/features/filter/filterSlice'
import { addStatusValue } from '../../redux/features/userInfo/userValueSlice'

interface ItemProps {
  label: string
  value: string
}

interface StatusInput {
  onChange?: () => void
  initValue: string[]
}

const options: ItemProps[] = []

for (let i = 0; i < statusData.length; i++) {
  const _ignoreList = IGNORE_STT_DEFAULT()
  const value = statusData[i]
  const isFound = _ignoreList.some((element) => {
    if (element.id === statusData[i].id) {
      return true
    }

    return false
  })
  if (!isFound) {
    options.push({
      label: value.name,
      value: value.name,
    })
  }
}

const StatusSelector: React.FC<StatusInput> = ({ onChange, initValue }) => {
  const [value, setValue] = useState<string[]>(initValue)
  const [changeValue, setChangeValue] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(addStatusValue(value))
      dispatch(addStatus(value))
      if (onChange) onChange()
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [changeValue])

  const selectProps: SelectProps = {
    showSearch: true,
    allowClear: true,
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: string[]) => {
      setValue(newValue)
      setChangeValue(!changeValue)
    },
    onClear: () => {
      setValue([])
      setChangeValue(!changeValue)
    },
    placeholder: 'Select status',
    maxTagCount: 'responsive',
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select {...selectProps} />
    </Space>
  )
}

export default StatusSelector
