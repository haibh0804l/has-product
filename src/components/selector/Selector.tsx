import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Select, Space } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { GetAllFilter } from '../../data/allUsersService'
import { Users } from '../../data/database/Users'
import UserIcon from '../UserIcon'

interface SelectorInput {
  placeHolder: string
  type: string
  onChangeFunc?: (e: string[]) => void
  onDeleteTag?: (e: string) => void
  clearAll?: boolean
}

const { Option } = Select

const Selector: React.FC<SelectorInput> = ({
  placeHolder,
  type,
  onChangeFunc,
  clearAll,
}) => {
  const [innerValue, setInnerValue] = useState<string[]>()
  const [userList, setUserList] = useState<Users[]>()

  const fetchData = useCallback(async () => {
    const response: Users[] = await GetAllFilter(type)
    setUserList(response)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (clearAll) {
      setInnerValue([])
    }
  }, [clearAll])

  const onChangeValue = (value: string[], option: any) => {
    setInnerValue(value)
  }

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        minHeight: '100px',
        backgroundColor: '#d9d9d9',
        padding: '10px 10px 0px 10px',
      }}
    >
      <Select
        showSearch
        showArrow
        allowClear
        key={placeHolder}
        tokenSeparators={[',']}
        style={{ width: '100%', marginBottom: '3%' }}
        mode="multiple"
        placeholder={placeHolder}
        //onChange={onChange}
        onChange={(value, option) => {
          onChangeValue(value, option)
          if (onChangeFunc) onChangeFunc(value)
        }}
        optionLabelProp="label"
        filterOption={(input, option) =>
          (option?.label ?? '').toString().includes(input)
        }
        value={innerValue}
        listHeight={120}
        maxTagCount="responsive"
      >
        {userList &&
          userList.map((element) => {
            return (
              <Option
                key={element._id!}
                value={element._id}
                label={element.UserName!.substring(
                  0,
                  element.UserName!.indexOf('@'),
                )}
              >
                <Space direction="horizontal" size="small" align="center">
                  <UserIcon
                    username={element.Name}
                    userColor={element.Color}
                    tooltipName={element.UserName}
                    userInfo={element}
                  />
                  <h4>{element.Name}</h4>
                </Space>
              </Option>
            )
          })}
      </Select>
      {/* {innerValue &&
        innerValue.map((tag, index) => {
          return (
            <Tag
              key={tag}
              closable
              onClose={() => {
                setInnerValue(innerValue.filter((element) => element != tag))
                if (onDeleteTag) onDeleteTag(tag)
              }}
            >
              {tag.substring(0, tag.indexOf('@'))}
            </Tag>
          )
        })} */}
    </div>
  )
}

export default Selector
