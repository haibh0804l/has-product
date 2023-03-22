import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faSquare } from '@fortawesome/free-solid-svg-icons'

const statusData = [
  {
    id: 1,
    name: 'To do',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#E5E7EB',
  },
  {
    id: 2,
    name: 'In progress',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#93C5FD',
  },
  {
    id: 3,
    name: 'Done',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#A855F7',
  },
  {
    id: 4,
    name: 'Pending',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#FDE047',
  },
  {
    id: 5,
    name: 'Completed',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#14B8A6',
  },
  {
    id: 6,
    name: 'Incompleted',
    icon: <FontAwesomeIcon icon={faSquare} />,
    color: '#de3163',
  },
]

export { statusData }
