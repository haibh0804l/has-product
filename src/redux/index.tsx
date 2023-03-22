import store from './app/store'
import { fetchUsers } from './features/user/userSlice'

export const storeIndex = () => {
  console.log('Initial state ', JSON.stringify(store.getState()))
  const unsubscribe = store.subscribe(() => {
    console.log('Updated state ', JSON.stringify(store.getState()))
  })

  store.dispatch(fetchUsers())

  /* store.dispatch(cakeOrdered())
  store.dispatch(cakeOrdered())
  store.dispatch(cakeOrdered())
  store.dispatch(cakeRestocked(4))

  store.dispatch(iceCreamOrdered())
  store.dispatch(iceCreamRestocked(2))
 */
  //unsubscribe()
}
