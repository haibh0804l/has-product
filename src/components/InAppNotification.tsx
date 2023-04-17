import { Users } from '../data/database/Users'
import { getCookie } from 'typescript-cookie'
import {
  NovuProvider,
  PopoverNotificationCenter,
  MessageActionStatusEnum,
  NotificationBell,
  IMessage,
} from '@novu/notification-center'

function onNotificationClick(message: IMessage) {
  // your logic to handle the notification click
  if (message?.cta?.data?.url) {
    window.location.href = message.cta.data.url
  }
}

const InAppNotification = () => {
  let assignee: Users[] = []
  const _assignUser: Users[] = []
  const userInfo: Users = JSON.parse(getCookie('userInfo')!)

  return (
    <NovuProvider
      styles={{
        loader: {
          root: { backgroundColor: '#D3D3D3', font: '' },
        },
      }}
      backendUrl={process.env.REACT_APP_BACKEND_URL!}
      socketUrl={process.env.REACT_APP_SOCKET_URL!}
      subscriberId={userInfo._id!}
      applicationIdentifier={process.env.REACT_APP_APPLICATIONIDENTIFIER!}
    >
      <>
        <PopoverNotificationCenter
          colorScheme="light"
          onNotificationClick={onNotificationClick}
          showUserPreferences={false}
          // header={() => (
          //   <h1
          //     style={{ backgroundColor: '#DCDCDC', paddingLeft: '10px' }}
          //     className="Notifications"
          //   >
          //     Notifications
          //   </h1>
          // )}
          footer={() => <h1></h1>}
        >
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>

        {/* <CustomNotificationCenter /> */}
      </>
    </NovuProvider>
  )
}

export default InAppNotification
