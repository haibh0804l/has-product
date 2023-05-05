import { faFrown, faSmile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  SelectProps,
  Slider,
  Space,
  Spin,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ModifierKey, useCallback, useEffect, useState } from 'react'
import { Tasks } from '../data/database/Tasks'
import '../assets/css/layout.css'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/services/tasksService'
import { ASSIGNEE, PROJECT, REPORTER, UPDATE_FAIL } from '../util/ConfigText'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { fetchFilterResult } from '../redux/features/filter/filterSlice'
import { CategoriesRequest, Category } from '../data/database/Categories'
import { GetCategories } from '../data/services/categories'
import { ToLowerCaseNonAccentVietnamese } from '../util/FormatText'

interface ItemProps {
  label: string
  value: string
}

interface ScoreCompParam {
  task: Tasks
  openModal: boolean
  closeFunc: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  updateFunc?: (e: any) => void
  newStatus?: string
  defaultScore?: number
  title?: string
}

interface CategoryCompParam {
  category: Category
}

const RejectModal: React.FC<ScoreCompParam> = ({
  task,
  openModal,
  closeFunc,
  updateFunc,
  newStatus,
  title,
}) => {
  const [value, setValue] = useState<string>()
  const [reason, setReason] = useState('')
  const [textAreatext, setTextAreatext] = useState('')
  const [isTextAreaDisable, setIsTextAreaDisable] = useState(true)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [options, setOptions] = useState<ItemProps[]>([])
  const filterInit = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  const selectProps: SelectProps = {
    showSearch: true,
    allowClear: true,
    style: { width: '100%' },
    value,
    options,
    optionFilterProp: 'children',
    filterOption: (input, option) => {
      return ToLowerCaseNonAccentVietnamese(
        (option?.label ?? '').toString(),
      ).includes(ToLowerCaseNonAccentVietnamese(input))
    },
    onChange: (newValue: string) => {
      setValue(newValue)
      onChangeValue(newValue)
      //setChangeValue(!changeValue)
    },
    onClear: () => {
      setValue('')
      setIsTextAreaDisable(true)
      setIsSubmitDisabled(true)
      setTextAreatext('')
      setReason('')
      //setChangeValue(!changeValue)
    },
    placeholder: 'Select reason',
  }

  const onChangeValue = (value: string) => {
    setValue(value)
    if (value === '14') {
      setIsTextAreaDisable(false)

      if (textAreatext !== '') {
        setIsSubmitDisabled(false)
      } else {
        setIsSubmitDisabled(true)
      }
    } else {
      setReason(options.filter((element) => element.value === value)[0].label)
      setIsSubmitDisabled(false)
      setIsTextAreaDisable(true)
    }
  }

  const fetchData = useCallback(async (req: CategoriesRequest) => {
    try {
      const response = await GetCategories(req)
      const data: Category[] = response.data
      const _option: ItemProps[] = []
      data.forEach((element) => {
        _option.push({
          label: element.Name,
          value: element.CategoryId.toString(),
        })
      })
      if (_option.length > 0) {
        const _optionFilter = _option.filter(
          (element) => element.value === '14',
        )
        _option.push(_option.splice(_option.indexOf(_optionFilter[0]), 1)[0])
      }

      setOptions(_option)
    } catch {}
  }, [])

  useEffect(() => {
    fetchData({ type: 'ClosedReason' })
  }, [fetchData])

  const updateTask = async (e: any) => {
    //setLoading(true)
    const inputTask: InputTasks = {
      StatusCategory: newStatus!,
      ReasonForClosed: reason,
      CancelDate: new Date(),
      //CloseDate: new Date(),
    }
    try {
      const updatedValue = await UpdateTask('', task._id!, inputTask)
      if (updatedValue.errorMessage === undefined) {
        //success
        //Modal.destroyAll()

        if (filterInit.tabs === '1') {
          dispatch(
            fetchFilterResult({
              filter: filterInit.filter,
              type: ASSIGNEE,
            }),
          )
        } else if (filterInit.tabs === '2') {
          dispatch(
            fetchFilterResult({
              filter: filterInit.filter,
              type: REPORTER,
            }),
          )
        } else {
          dispatch(
            fetchFilterResult({
              filter: filterInit.filter,
              type: PROJECT,
            }),
          )
        }

        if (closeFunc) closeFunc(e)
      } else {
        //fail
        notification.open({
          message: 'Notification',
          description: UPDATE_FAIL,
          duration: 2,
          onClick: () => {
            //console.log('Notification Clicked!')
          },
        })
      }
    } catch {
      notification.open({
        message: 'Notification',
        description: UPDATE_FAIL,
        duration: 2,
        onClick: () => {
          //console.log('Notification Clicked!')
        },
      })
    }
    //setLoading(false)
  }

  return (
    <>
      <Modal
        title={<center style={{ marginTop: '20px' }}>{title}</center>}
        open={openModal}
        onCancel={closeFunc}
        width="25%"
        footer={
          <>
            <Button
              type="primary"
              onClick={(e) => updateTask(e)}
              disabled={isSubmitDisabled}
            >
              Confirm
            </Button>
            <Button
              type="primary"
              onClick={(e) => closeFunc(e as any)}
              style={{ backgroundColor: '#DC3545' }}
            >
              Cancel
            </Button>
          </>
        }
        keyboard={false}
      >
        <>
          <p style={{ fontSize: '15px' }}>Chọn lý do hủy</p>
          <Select {...selectProps} />
          {!isTextAreaDisable && (
            <TextArea
              placeholder="Nhập lý do khác"
              maxLength={50}
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{ marginTop: '10px' }}
              value={textAreatext}
              onChange={(e) => {
                setTextAreatext(e.target.value)
                setReason(e.target.value)
                if (value === '14') {
                  if (e.target.value !== '') {
                    setIsSubmitDisabled(false)
                  } else {
                    setIsSubmitDisabled(true)
                  }
                } else {
                  setIsSubmitDisabled(false)
                }
              }}
            />
          )}
        </>
      </Modal>
    </>
  )
}

export default RejectModal
