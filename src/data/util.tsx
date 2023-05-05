import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faSquare } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Spin } from 'antd'

interface Tasks {
  type: string
  text: string
}

const FindIcon: React.FC<Tasks> = ({ type, text }) => {
  const _statusList = JSON.parse(localStorage.getItem('statusData')!)
  const _priorityList = JSON.parse(localStorage.getItem('priorityData')!)
  const [isFound, setIsFound] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState<string>('')
  const [icon, setIcon] = useState<IconProp>(faSquare)
  const [name, setName] = useState('')

  const RenderIcon = () => {
    setLoading(true)
    if (type === 'Priority') {
      setIcon(faFlag)
      for (let index = 0; index < _priorityList.length; index++) {
        const element = _priorityList[index]
        if (element.CategoryId == +text) {
          setColor(element.Color)
          setName(element.Name)
          setIsFound(true)
          break
        } else {
          setIsFound(false)
        }
      }
    } else {
      setIcon(faSquare)
      for (let index = 0; index < _statusList.length; index++) {
        const element = _statusList[index]
        if (element.CategoryId == +text) {
          setColor(element.Color)
          setName(element.Name)
          setIsFound(true)
          break
        } else {
          setIsFound(false)
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    RenderIcon()
  }, [])

  useEffect(() => {
    RenderIcon()
  }, [type, text])

  return (
    <>
      {!loading ? (
        <FontAwesomeIcon icon={icon} color={color} title={name} />
      ) : (
        <Spin size="small" />
      )}
    </>
  )
}

export default FindIcon
