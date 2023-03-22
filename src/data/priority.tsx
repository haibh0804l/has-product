import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default [
  {
    id: 1,
    name: 'Urgent',
    icon: <FontAwesomeIcon icon={faFlag} color="#F43F5E" />,
    color: '#F43F5E',
  },
  {
    id: 2,
    name: 'High',
    icon: <FontAwesomeIcon icon={faFlag} color="#FACC15" />,
    color: '#FACC15',
  },
  {
    id: 3,
    name: 'Medium',
    icon: <FontAwesomeIcon icon={faFlag} color="#2DD4BF" />,
    color: '#2DD4BF',
  },
  {
    id: 4,
    name: 'Low',
    icon: <FontAwesomeIcon icon={faFlag} color="#4B5563" />,
    color: '#4B5563',
  },
  {
    id: 5,
    name: 'Undefined',
    icon: <FontAwesomeIcon icon={faFlag} color="#4B5563" />,
    color: '#E5E7EB',
  },
]
