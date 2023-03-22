import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, MenuProps, Popover } from 'antd'
import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'

dayjs.extend(customParseFormat)

const { RangePicker } = DatePicker

const range = (start: number, end: number) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day')
}

const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
})

const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    }
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  }
}

const CustomTimeComponent: React.FC = () => {
  return <RangePicker disabledDate={disabledDate} />
}

const InnerDropdown: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setOpen(true)
  }

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag)
  }

  const innerItem: MenuProps['items'] = [
    {
      key: 'Time',
      label: <CustomTimeComponent />,
    },
  ]

  return (
    <Dropdown
      menu={{ items: innerItem, onClick: handleMenuClick }}
      placement="topLeft"
      trigger={['click']}
      arrow={{ pointAtCenter: false }}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Custom Time</Button>
    </Dropdown>
  )
}

const content = <CustomTimeComponent />

const CustomPopOver: React.FC = () => {
  return (
    <Popover placement="right" title="" content={content} trigger="click">
      <Button type="primary">Custom Time</Button>
    </Popover>
  )
}

const ExportMenu = () => {
  const [open, setOpen] = useState(false)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setOpen(true)
  }

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag)
  }

  const items: MenuProps['items'] = [
    {
      key: 'CustomTime',
      //label: <InnerDropdown />,
      label: <CustomPopOver />,
    },
    {
      key: 'Export',
      label: (
        <center>
          <Button type="primary" disabled={true}>
            Export
          </Button>
        </center>
      ),
    },
  ]

  return (
    <Dropdown
      open={open}
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomLeft"
      trigger={['click']}
      arrow={{ pointAtCenter: false }}
      onOpenChange={handleOpenChange}
    >
      <FontAwesomeIcon icon={faEllipsisVertical} size="lg" cursor="pointer" />
    </Dropdown>
  )
}

export default ExportMenu
