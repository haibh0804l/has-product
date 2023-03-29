import React, { useEffect, useState } from 'react'
import type { SelectProps } from 'antd'
import { Select, Space } from 'antd'
import { Users } from '../../data/database/Users'
import { REPORTER } from '../../util/ConfigText'
import { SetFilterState } from '../../util/SetFilterState'
import { useAppDispatch } from '../../redux/app/hook'
import { addReporter } from '../../redux/features/filter/filterSlice'

interface ItemProps {
  label: string
  value: string
}

interface UserInput {
  users: Users[]
  disabled: boolean
  onChange?: () => void
}

const ReporterSelector: React.FC<UserInput> = ({
  users,
  onChange,
  disabled = false,
}) => {
  const [value, setValue] = useState<string[]>([])
  const [options, setOptions] = useState<ItemProps[]>([])
  const [changeValue, setChangeValue] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const _options: ItemProps[] = []
    for (let index = 0; index < users.length; index++) {
      const element = users[index]
      _options.push({
        label: element.UserName!,
        value: element._id!,
      })
    }
    setOptions(_options)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(addReporter(value))
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
    placeholder: 'Select Assignee',
    maxTagCount: 'responsive',
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select {...selectProps} disabled={disabled} />
    </Space>
  )
}

export default ReporterSelector
