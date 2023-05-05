import { log } from 'console'
import React from 'react'

interface Input {
  customKey: any
  children: React.ReactNode
}

interface ComponentProps {
  customvalue: any
}

export const ReactElementMapping: React.FC<Input> = ({
  customKey,
  children,
}) => {
  return React.createElement<ComponentProps>(
    'div',
    { customvalue: customKey },
    children,
  )
  //return <div myKey={key}></div>
}

export const Sorter = (a: any, b: any, c?: string) => {
  const taskA = JSON.parse(JSON.stringify(a))
  const taskB = JSON.parse(JSON.stringify(b))
  if (c === 'dueDate') {
    console.log('DUEDATE')
    //console.log(taskA.props.children.props)
    if (taskA.props.children.props && taskB.props.children.props) {
      if (
        taskA.props.children.props.customKey &&
        taskB.props.children.props.customKey
      ) {
        if (
          (taskA.props.children.props.customKey as Date) >
          (taskB.props.children.props.customKey as Date)
        )
          return 1

        if (
          (taskA.props.children.props.customKey as Date) <
          (taskB.props.children.props.customKey as Date)
        )
          return -1
      } else {
        if (
          taskA.props.children.props.customKey &&
          !taskB.props.children.props.customKey
        ) {
          return -1
        } else if (
          !taskA.props.children.props.customKey &&
          taskB.props.children.props.customKey
        ) {
          return 1
        } else {
          return 0
        }
      }
    } else {
      if (taskA.props.children.props && !taskB.props.children.props) {
        return 1
      } else if (!taskA.props.children.props && taskB.props.children.props) {
        return -1
      } else {
        return 0
      }
    }
  } else {
    if (taskA.props.customKey && taskB.props.customKey) {
      if (typeof taskA.props.customKey === 'string') {
        return (taskA.props.customKey as string).localeCompare(
          taskB.props.customKey as string,
        )
        console.log('String')
      } else if (typeof taskA.props.customKey === 'number') {
        if (
          (taskA.props.customKey as number) > (taskB.props.customKey as number)
        )
          return 1
        if (
          (taskA.props.customKey as number) < (taskB.props.customKey as number)
        )
          return -1
        console.log('Number')
      } else if (typeof taskA.props.customKey.getMonth === 'function') {
        console.log('Date')
        if (
          (taskA.children.props.customKey as Date).getTime() >
          (taskB.children.props.customKey as Date).getTime()
        )
          return 1

        if (
          (taskA.children.props.customKey as Date).getTime() <
          (taskB.children.props.customKey as Date).getTime()
        )
          return -1
      }
    } else {
      if (taskA.props.customKey && !taskB.props.customKey) {
        return 1
      } else if (!taskA.props.customKey && taskB.props.customKey) {
        return -1
      } else {
        return 0
      }
    }

    // }
    // }
  }
  return 0
}
