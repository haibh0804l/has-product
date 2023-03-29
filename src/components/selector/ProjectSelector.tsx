import React, { useEffect, useState } from 'react'
import type { SelectProps } from 'antd'
import { Select, Space } from 'antd'
import { ProjectRepsonse } from '../../data/database/Project'
import { useAppDispatch } from '../../redux/app/hook'
import { addProject } from '../../redux/features/filter/filterSlice'

interface ItemProps {
  label: string
  value: string
}

interface ProjectSelectorInput {
  project: ProjectRepsonse[]
  onChange?: () => void
}

const _options: ItemProps[] = []

const ProjectSelector: React.FC<ProjectSelectorInput> = ({
  project,
  onChange,
}) => {
  const [value, setValue] = useState<string[]>([])
  const [options, setOptions] = useState<ItemProps[]>([])
  const [changeValue, setChangeValue] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const _options: ItemProps[] = []
    for (let index = 0; index < project.length; index++) {
      const element = project[index]
      _options.push({
        label: element.ProjectName!,
        value: element._id!,
      })
    }
    setOptions(_options)
  }, [project])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(addProject(value))
      if (onChange) onChange()
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [changeValue])

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options: options,
    onChange: (newValue: string[]) => {
      setValue(newValue)
      setChangeValue(!changeValue)
    },
    placeholder: 'Select Projects',
    maxTagCount: 'responsive',
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select {...selectProps} />
    </Space>
  )
}

export default ProjectSelector
