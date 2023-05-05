import { faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Space, UploadFile } from 'antd'
import { useEffect, useState } from 'react'
import '../assets/css/index.css'

interface UploadListCompInput {
  files: UploadFile[]
  onRemove: (value: string) => void
  isDeleteDisabled: boolean
}

interface MiniCompInput {
  file: UploadFile
  onRemove: (value: string) => void
  isDeleteDisabled: boolean
}

const MiniComp: React.FC<MiniCompInput> = ({
  file,
  onRemove,
  isDeleteDisabled,
}) => {
  const _onRemove = (value: string) => {
    onRemove(value)
  }

  /* const [deletedBtn, setDeletedBtn] = useState(isDeleteDisabled)
  useEffect(() => {
    setDeletedBtn(isDeleteDisabled)
  }, [isDeleteDisabled])
 */
  return (
    <Row
      className="fileListSpace"
      style={{ cursor: 'pointer' }}
      onClick={() => window.open(file.url, '_blank')}
    >
      <Col>
        <FontAwesomeIcon icon={faPaperclip} />
      </Col>
      <Col>
        <a target={'_blank'} title={file.name}>
          {file.name}
        </a>
      </Col>
      <Col flex="auto"></Col>
      {!isDeleteDisabled && (
        <Col>
          <Button
            type="text"
            title="Remove File"
            size="small"
            icon={
              <FontAwesomeIcon
                className="btnIcon"
                icon={faTrash}
                style={{ display: 'none' }}
              />
            }
            className="hiddenBtn"
            style={{ backgroundColor: 'transparent' }}
            onClick={(e) => {
              e.stopPropagation()
              _onRemove(file.uid)
            }}
          />
        </Col>
      )}
    </Row>
  )
}

const CustomFileList: React.FC<UploadListCompInput> = ({
  files,
  onRemove,
  isDeleteDisabled,
}) => {
  const [input, setInput] = useState<UploadFile[]>(files)

  useEffect(() => {
    setInput(files)
  }, [files])

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {input.map((element) => {
        return (
          <MiniComp
            file={element}
            onRemove={onRemove}
            isDeleteDisabled={isDeleteDisabled}
          />
        )
      })}
    </Space>
  )
}

export default CustomFileList
