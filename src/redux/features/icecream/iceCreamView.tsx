import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hook'
import { iceCreamOrdered, iceCreamRestocked } from './icecreamSlice'

export const IceCreamView = () => {
  const [value, setValue] = useState(1)
  const numOfIceCreams = useAppSelector(
    (state) => state.icecream.numOfIceCreams,
  )
  const dispatch = useAppDispatch()
  return (
    <div>
      <h2>Number of ice creams - {numOfIceCreams}</h2>
      <button onClick={() => dispatch(iceCreamOrdered())}>
        Order ice cream
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
      <button onClick={() => dispatch(iceCreamRestocked(value))}>
        Restock ice creams
      </button>
    </div>
  )
}
