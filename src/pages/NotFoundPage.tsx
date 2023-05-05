import { useEffect } from 'react'
import { PageName } from '../data/interface/PageName'

const NotFoundPage: React.FC<PageName> = ({ name }) => {
  useEffect(() => {
    document.title = name
  }, [])
  return <h1>The contents you try to access is not available</h1>
}

export default NotFoundPage
