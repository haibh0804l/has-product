import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AboutPage from './pages/About'
import HomePage from './pages/HomePage'
import MyWork from './pages/MyWork'
import SettingPage from './pages/Settings'
import { CustomRoutes } from './customRoutes'
import Signin from './pages/authentication/Signin'
import TaskDetails from './pages/TaskDetails'
import Dashboard from './pages/Dashboard'
import NotFoundPage from './pages/NotFoundPage'
import ProjectModal from './components/project/ProjectModal'
import ProjectDetails from './pages/ProjectDetails'

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path={CustomRoutes.HomePage.path}
          element={<HomePage name={CustomRoutes.HomePage.name} />}
        >
          <Route
            path={CustomRoutes.Dashboard.path}
            element={<Dashboard name={CustomRoutes.Dashboard.name} />}
          />
          <Route
            path={CustomRoutes.MyWork.path}
            element={<MyWork name={CustomRoutes.MyWork.name} />}
          ></Route>
          <Route
            path={CustomRoutes.MyWork.path + '/:id'}
            element={<MyWork name={CustomRoutes.MyWork.name} />}
          ></Route>
          <Route
            path="*"
            element={<NotFoundPage name={CustomRoutes.NotFoundPage.name} />}
          />
          <Route
            path={CustomRoutes.TaskDetails.path + '/:id'}
            element={
              <TaskDetails
                openModal={true}
                name={CustomRoutes.TaskDetails.name}
              />
            }
          />
          <Route
            path={CustomRoutes.Project.path + '/:id'}
            element={
              <ProjectDetails
                openModal={true}
                name={CustomRoutes.Project.name}
              />
            }
          />
          <Route path={CustomRoutes.Setting.path} element={<SettingPage />} />
          <Route path={CustomRoutes.About.path} element={<AboutPage />} />
        </Route>

        <Route
          path={CustomRoutes.Signin.path}
          element={<Signin name="HAS Product" />}
        ></Route>
        <Route
          path="*"
          element={<NotFoundPage name={CustomRoutes.NotFoundPage.name} />}
        />
      </Routes>
    </>
  )
}

export default MainRoutes
