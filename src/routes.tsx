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
import { getCookie } from 'typescript-cookie'

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path={CustomRoutes.HomePage.path} element={<HomePage />}>
          <Route path={CustomRoutes.Dashboard.path} element={<Dashboard />} />
          <Route path={CustomRoutes.MyWork.path} element={<MyWork />}></Route>
          <Route
            path={CustomRoutes.TaskDetails.path + '/:id'}
            element={<TaskDetails openModal={true} />}
          />
          <Route path={CustomRoutes.Setting.path} element={<SettingPage />} />
          <Route path={CustomRoutes.About.path} element={<AboutPage />} />
        </Route>

        <Route path={CustomRoutes.Signin.path} element={<Signin />}></Route>
      </Routes>
    </>
  )
}

export default MainRoutes
