import {
  faFilter,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, DatePicker, Divider, Popover, Row, Space } from 'antd'
import { useEffect, useState } from 'react'
import {
  ASSIGNEE,
  PROJECT,
  REPORTER,
  revertAll,
  SELECT,
} from '../../util/ConfigText'
import RemoteSelector from '../selector/RemoteSelector'
import StatusSelector from '../selector/StatusSelector'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { DateFilter, FilterRequest } from '../../data/interface/FilterInterface'
import filterSlice, {
  addClosedDate,
  addDueDate,
  fetchFilterResult,
} from '../../redux/features/filter/filterSlice'
import PrioritySelector from '../selector/PrioritySelector'
import {
  addCloseDateValue,
  addDueDateValue,
} from '../../redux/features/userInfo/userValueSlice'
import { RangePickerProps } from 'antd/es/date-picker'
import RemoteSelectorProject from '../selector/RemoteSelectorProject'

dayjs.extend(customParseFormat)

interface MiniCompInput {
  condition: React.ReactNode
  value: React.ReactNode
}

const MiniComp: React.FC<MiniCompInput> = ({ condition, value }) => {
  return (
    <Row gutter={10} style={{ marginBottom: '5px' }}>
      <Col span={8}>{condition}</Col>
      <Col span={16} style={{ width: '100%' }}>
        {value}
      </Col>
    </Row>
  )
}

const onChange = (date: Dayjs) => {
  if (date) {
    console.log('Date: ', date)
  } else {
    console.log('Clear')
  }
}

const rangePresets: {
  label: string
  value: [Dayjs, Dayjs]
}[] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]

const Comp: React.FC = () => {
  const initValue = useAppSelector((state) => state.userValue)
  const dispatch = useAppDispatch()
  const { RangePicker } = DatePicker

  /* useEffect(() => {
    console.log('My init value ' + JSON.stringify(initValue))
  }, [initValue])

  const onClickSubmit = () => {
    //search goes here
    const filterRequest: FilterRequest = {
      filter: _filter.filter,
    }

    console.log('Filter me ' + JSON.stringify(filterRequest))
    dispatch(fetchFilterResult(filterRequest))
  } */

  const onClearFilter = () => {
    //reset to init state
    dispatch(revertAll())
  }

  const onRangeDueDateChange = (
    value: RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    if (value) {
      const dateFilter: DateFilter = {
        fromDate: value[0]?.toDate(),
        toDate: value[1]?.toDate(),
      }
      dispatch(addDueDateValue(value))
      dispatch(addDueDate(dateFilter))
    } else {
      const dateFilter: DateFilter = {
        fromDate: undefined,
        toDate: undefined,
      }
      dispatch(addDueDateValue(value))
      dispatch(addDueDate(dateFilter))
    }
  }

  const onRangeCloseDateChange = (
    value: RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    if (value) {
      const dateFilter: DateFilter = {
        fromDate: value[0]?.toDate(),
        toDate: value[1]?.toDate(),
      }
      dispatch(addCloseDateValue(value))
      dispatch(addClosedDate(dateFilter))
    } else {
      const dateFilter: DateFilter = {
        fromDate: undefined,
        toDate: undefined,
      }
      dispatch(addCloseDateValue(value))
      dispatch(addClosedDate(dateFilter))
    }
  }

  return (
    <div style={{ width: 500 }}>
      <Divider
        style={{ margin: '0px 0px 10px 0px', backgroundColor: '#f6f1f1' }}
      />
      <MiniComp
        condition={<p style={{ fontWeight: '600' }}>Condition</p>}
        value={<p style={{ fontWeight: '600' }}>Value</p>}
      />
      <MiniComp
        condition={<p>Project</p>}
        value={
          <RemoteSelectorProject
            placeHolder={SELECT + ' ' + PROJECT}
            initValue={initValue.project}
          />
        }
      />
      <MiniComp
        condition={<p>Assignee</p>}
        value={
          <RemoteSelector
            type={ASSIGNEE}
            placeHolder={SELECT + ' ' + ASSIGNEE}
            initValue={initValue.assignee}
          />
        }
      />
      <MiniComp
        condition={<p>Reporter</p>}
        value={
          <RemoteSelector
            type={REPORTER}
            placeHolder={SELECT + ' ' + REPORTER}
            initValue={initValue.reporter}
          />
        }
      />
      <MiniComp
        condition={<p>Status</p>}
        value={<StatusSelector initValue={initValue.status} />}
      />
      <MiniComp
        condition={<p>Priority</p>}
        value={<PrioritySelector initValue={initValue.priority} />}
      />
      <MiniComp
        condition={<p>Due Date</p>}
        value={
          <RangePicker
            allowClear
            presets={rangePresets}
            onChange={onRangeDueDateChange}
            style={{ width: '100%' }}
            value={initValue.dueDate}
          />
        }
      />
      <MiniComp
        condition={<p>Closed Date</p>}
        value={
          <RangePicker
            allowClear
            presets={rangePresets}
            onChange={onRangeCloseDateChange}
            style={{ width: '100%' }}
            value={initValue.closeDate}
          />
        }
      />
      <MiniComp
        condition={undefined}
        value={
          <Space direction="horizontal" size={10} style={{ float: 'right' }}>
            <Button onClick={onClearFilter}>Clear filter</Button>
            {/* <Button type="primary" onClick={() => onClickSubmit()}>
              Submit
            </Button> */}
          </Space>
        }
      />
    </div>
  )
}

const FilterOptions = () => {
  const [openFilter, setOpenFilter] = useState(false)

  return (
    <Popover
      placement="bottomLeft"
      title="Filter"
      content={<Comp />}
      trigger="click"
    >
      {!openFilter ? (
        <FontAwesomeIcon
          icon={faFilter}
          size="lg"
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() => setOpenFilter(!openFilter)}
        />
      ) : (
        <FontAwesomeIcon
          icon={faFilterCircleXmark}
          size="lg"
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() => setOpenFilter(!openFilter)}
        />
      )}
    </Popover>
  )
}

export default FilterOptions
