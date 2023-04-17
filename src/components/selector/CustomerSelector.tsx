import React, { useCallback, useEffect, useState } from 'react'
import type { SelectProps } from 'antd'
import { Select, Space } from 'antd'
import { CustomerFilter } from '../../data/services/filterService'
import { CustomerResponse } from '../../data/database/Customer'
import { SelectorValue } from '../../data/interface/SelectorValue'

interface ItemProps {
  label: string
  value: string
}

interface UserInput {
  initValue: string
  disabled: boolean
  onChange?: (e: any) => void
}

const CustomerSelector: React.FC<UserInput> = ({
  initValue,
  onChange,
  disabled = false,
}) => {
  const [value, setValue] = useState<string>()
  const [options, setOptions] = useState<ItemProps[]>([])
  const [changeValue, setChangeValue] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const customer = await CustomerFilter()
      const customerData: CustomerResponse[] = customer.data
      const _options: ItemProps[] = []
      for (let index = 0; index < customerData.length; index++) {
        const element = customerData[index]
        _options.push({
          label: element.CustomerName,
          value: element._id!,
        })
      }
      setOptions(_options)
    } catch (error) {}
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (initValue !== '') {
      setValue(initValue)
    }
  }, [initValue])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onChange) onChange(value)
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [changeValue])

  const selectProps: SelectProps = {
    showSearch: true,
    allowClear: true,
    style: { width: '100%' },
    value: value,
    options: options,
    onChange: (newValue: string) => {
      setValue(newValue)
      setChangeValue(!changeValue)
    },
    onClear: () => {
      setValue('')
      setChangeValue(!changeValue)
    },
    optionFilterProp: 'children',
    filterOption: (input, option) => {
      return (option?.label ?? '')
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase())
    },
    placeholder: 'Select Customer',
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select {...selectProps} disabled={disabled} />
    </Space>
  )
}

export default CustomerSelector
