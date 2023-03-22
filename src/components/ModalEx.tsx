import { Modal } from 'antd'
import { useState } from 'react'

type OpenMe = {
  opening: boolean
  closeFunc: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const ModalEx: React.FC<OpenMe> = ({ opening, closeFunc }) => {
  //const [miniModal, setMiniModal] = useState(opening)
  return (
    <>
      <h1>Hello</h1>
      <Modal
        title="Review and Mark"
        open={opening}
        //onOk={this.handleOk}
        onCancel={closeFunc}
        width="30%"
        footer={[]}
      ></Modal>
    </>
  )
}
