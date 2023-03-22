import React from 'react'
import { ConfigProvider } from 'antd'
import { SocketContext, socket } from './context'

import MainRoutes from './routes'

const App: React.FC = () => {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                colorPrimary: '#0E7490',
              },
              Layout: {
                colorBgBody: '#FFFFFF',
                colorPrimary: '#0E7490',
              },
              Tooltip: {
                colorBgTextHover: '#0E7490',
              },
            },
            token: {
              colorPrimary: '#0E7490',
              fontFamily: 'Roboto',
            },
          }}
        >
          <MainRoutes />
        </ConfigProvider>
      </SocketContext.Provider>
    </>
  )
}

export default App
