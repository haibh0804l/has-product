import { faFilter, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
} from 'antd'
import { stat } from 'fs'
import { MouseEvent, useEffect, useState } from 'react'
import { ProjectRepsonse } from '../../data/database/Project'
import { Users } from '../../data/database/Users'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import {
  addCompleted,
  addTaskName,
} from '../../redux/features/filter/filterSlice'
import {
  ASSIGNEE,
  MANAGER,
  PROJECT,
  REPORTER,
  SEARCH,
  SELECT,
} from '../../util/ConfigText'
import ProjectCreation from '../ProjectCreation'
import AssigneeSelector from '../selector/AssigneeSelector'
import ProjectSelector from '../selector/ProjectSelector'
import RemoteSelector from '../selector/RemoteSelector'
import RemoteSelectorProject from '../selector/RemoteSelectorProject'
import ReporterSelector from '../selector/ReporterSelector'
import StatusSelector from '../selector/StatusSelector'
import FilterOptions from './FilterOptions'

interface SearchBarInput {
  tabs: string
  projects: string[]
  assignee?: Users[]
  reporter?: Users[]
  status: any[]
}

const SearchBar: React.FC<SearchBarInput> = ({ tabs, assignee }) => {
  const initValue = useAppSelector((state) => state.userValue)
  const [searchValue, setSearchValue] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [changeValue, setChangeValue] = useState(false)
  const [spanFilterOption, setSpanFilterOption] = useState(1)

  useEffect(() => {
    if (tabs === '1') {
      setSpanFilterOption(4)
    } else {
      setSpanFilterOption(1)
    }
  }, [tabs])

  const dispatch = useAppDispatch()

  const OnChangeFunc = () => {
    //console.log(JSON.stringify(filter))
    setChangeValue(!changeValue)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(addTaskName(searchValue))
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [changeValue])

  return (
    <>
      <Row gutter={10} align="middle">
        <Col span={4}>
          <Input
            prefix={<FontAwesomeIcon icon={faSearch} />}
            placeholder={SEARCH}
            style={{
              border: 'none',
              float: 'left',
            }}
            value={searchValue!}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setChangeValue(!changeValue)
            }}
            allowClear
          />
        </Col>
        <Col span={7}>
          {tabs !== '1' && tabs !== '2' && <ProjectCreation />}
        </Col>
        <Col span={spanFilterOption}>
          <FilterOptions tabs={tabs} />
        </Col>
        <Col span={3}>
          <RemoteSelectorProject
            placeHolder={SELECT + ' ' + PROJECT}
            initValue={initValue.project}
            userType={
              tabs === '1' ? ASSIGNEE : tabs === '2' ? REPORTER : MANAGER
            }
          />
        </Col>
        {tabs !== '1' && (
          <Col span={3}>
            <RemoteSelector
              userType={tabs === '2' ? REPORTER : MANAGER}
              type={ASSIGNEE}
              placeHolder={SELECT + ' ' + ASSIGNEE}
              initValue={initValue.assignee}
            />
          </Col>
        )}
        <Col span={3}>
          <StatusSelector initValue={initValue.status} />
        </Col>
        <Col span={3}>
          <Checkbox
            onChange={(e) => {
              const saveBoolean: boolean = e.target.checked
              dispatch(addCompleted(saveBoolean))
              setShowCompleted(!showCompleted)
            }}
            style={{ width: 'auto' }}
          >
            Show closed tasks
          </Checkbox>
        </Col>
      </Row>
    </>
  )
}

export { SearchBar }
