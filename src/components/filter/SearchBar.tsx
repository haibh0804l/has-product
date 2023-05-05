import { faEllipsisH, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Checkbox, Col, Input, Popover, Row, Space } from 'antd'
import { useEffect, useState } from 'react'
import { Users } from '../../data/database/Users'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import {
  addClosedProject,
  addCompleted,
  addTaskName,
} from '../../redux/features/filter/filterSlice'
import { addTaskNameValue } from '../../redux/features/userInfo/userValueSlice'
import {
  ASSIGNEE,
  MANAGER,
  PROJECT,
  REPORTER,
  SEARCH,
  SELECT,
  STATUS,
} from '../../util/ConfigText'
import ProjectCreation from '../project/ProjectCreation'
import RemoteSelector from '../selector/RemoteSelector'
import RemoteSelectorProject from '../selector/RemoteSelectorProject'
import StatusSelector from '../selector/StatusSelector'
import FilterOptions from './FilterOptions'
import RemoteSelectorCategory from '../selector/RemoteSelectorCategory'

interface SearchBarInput {
  tabs: string
  projects: string[]
  assignee?: Users[]
  reporter?: Users[]
  status: any[]
}

const SearchBar: React.FC<SearchBarInput> = ({ tabs }) => {
  const initValue = useAppSelector((state) => state.userValue.filtered)
  const initFilter = useAppSelector((state) => state.filter)
  const [searchValue, setSearchValue] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showClosedProject, setShowClosedProject] = useState(false)
  const [changeValue, setChangeValue] = useState(false)
  const [spanFilterOption, setSpanFilterOption] = useState(1)
  const [hideProject, setHideProject] = useState(true)

  useEffect(() => {
    if (tabs === '1') {
      setHideProject(true)
      setSpanFilterOption(4)
    } else {
      if (tabs === '3') {
        setHideProject(false)
      } else {
        setHideProject(true)
      }
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
      dispatch(addTaskNameValue(searchValue))
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
          <RemoteSelectorCategory
            type={'Status'}
            placeHolder={SELECT + ' ' + STATUS}
            initValue={initValue.statusCategory}
          />
        </Col>
        <Col span={3}>
          <Space direction="horizontal" size={'small'}>
            <Checkbox
              checked={initFilter.filter.completed}
              onChange={(e) => {
                const saveBoolean: boolean = e.target.checked
                dispatch(addCompleted(saveBoolean))
                setShowCompleted(!showCompleted)
              }}
              style={{ width: 'auto' }}
            >
              Show closed tasks
            </Checkbox>
            {!hideProject && (
              <Popover
                placement="bottomRight"
                //title="Filter"
                content={
                  <Checkbox
                    checked={initFilter.filter.closedProject}
                    onChange={(e) => {
                      const saveBoolean: boolean = e.target.checked
                      dispatch(addCompleted(saveBoolean))
                      dispatch(addClosedProject(saveBoolean))
                      setShowClosedProject(!showClosedProject)
                    }}
                    style={{ width: 'auto' }}
                  >
                    Show closed project
                  </Checkbox>
                }
                trigger="click"
              >
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  style={{ float: 'right', cursor: 'pointer' }}
                />
              </Popover>
            )}
          </Space>
        </Col>
      </Row>
    </>
  )
}

export { SearchBar }
