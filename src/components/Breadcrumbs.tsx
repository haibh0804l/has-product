import React from 'react'
import { Breadcrumb } from 'antd'

interface BreadcrumbProps {
  main: string
  sub: string
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ main, sub }) => {
  return (
    <Breadcrumb separator=">" style={{ margin: '16px 16px' }}>
      {/* <Breadcrumb.Item>{main}</Breadcrumb.Item> */}
      {/* <Breadcrumb.Item>{sub}</Breadcrumb.Item> */}
    </Breadcrumb>
  )
}

export default Breadcrumbs
