import React from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hook'
import { cakeOrdered, cakeRestocked } from './cakeSlice'

export const CakeView = () => {
  //state refer to reducer in app/store
  const numOfCakses = useAppSelector((state) => state.cake.numOfCakes)
  const dispatch = useAppDispatch()
  return (
    <div>
      <h2>Number of cakes - {numOfCakses}</h2>
      <button onClick={() => dispatch(cakeOrdered())}>Order cake</button>
      <button onClick={() => dispatch(cakeRestocked(5))}>Restock cakes</button>
    </div>
  )
}
