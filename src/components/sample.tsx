import React, { useEffect, useState } from 'react'

type MyInput = {
  myValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MySample: React.FC<MyInput> = ({ myValue, onChange }) => {
  //const [inputType] = useState(props.type)
  const [inputValue, setInputValue] = useState(myValue)
  useEffect(() => {
    setInputValue(myValue) // action on update of movies
  }, [])
  /*  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    //if(value.onChange) value.onChange(inputValue)
  } */
  return (
    <>
      <input
        /* type={inputType}  */ value={myValue}
        name="input-form"
        onChange={onChange}
      />
    </>
  )
}

export default MySample
