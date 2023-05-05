import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import { useState } from 'react'
import ProjectModal from './ProjectModal'
import '../../assets/css/index.css'

const ProjectCreation = () => {
  const [projectCreation, setProjectCreation] = useState(false)
  return (
    <>
      <Button
        className="project-btn"
        icon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} />}
        onClick={() => setProjectCreation(true)}
      >
        Project
      </Button>
      <ProjectModal
        openModal={projectCreation}
        closeModal={() => setProjectCreation(false)}
      />
    </>
  )
}

export default ProjectCreation
