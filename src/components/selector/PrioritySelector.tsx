import React, { useEffect, useState } from 'react'
import type { SelectProps } from 'antd'
import { Select, Space } from 'antd'
import { useAppDispatch } from '../../redux/app/hook'
import priority from '../../data/priority'
import { addPriorityValue } from '../../redux/features/userInfo/userValueSlice'
import { addPriority } from '../../redux/features/filter/filterSlice'

interface ItemProps {
  label: string
  value: string
}

interface StatusInput {
  onChange?: () => void
  initValue: string[]
}

const options: ItemProps[] = []

for (let i = 0; i < priority.length; i++) {
  const value = priority[i]
  options.push({
    label: value.name,
    value: value.name,
  })
}

const PrioritySelector: React.FC<StatusInput> = ({ onChange, initValue }) => {
  const [value, setValue] = useState<string[]>(initValue)
  const [changeValue, setChangeValue] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(addPriorityValue(value))
      dispatch(addPriority(value))
      if (onChange) onChange()
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [changeValue])

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: string[]) => {
      setValue(newValue)
      setChangeValue(!changeValue)
    },
    placeholder: 'Select priority',
    maxTagCount: 'responsive',
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select {...selectProps} />
    </Space>
  )
}

export default PrioritySelector
