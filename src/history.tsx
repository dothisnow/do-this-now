import { MutableRefObject, useRef, useState } from 'react'
import { useLocation } from 'wouter'

import { HomeIcon } from '@heroicons/react/20/solid'

import Button from './components/button'
import Hints from './components/hints'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

import { useHistory } from './hooks/useHistory'
import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'

import { DynamoDBTask, Task as TaskType } from './types/task'

const History = () => {
  const [selectedTask, setSelectedTask] = useState(0)
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const navigate = useLocation()[1]

  const { data, isFetching } = useHistory()

  const tasks = (data?.Item?.tasks?.L || []) as { M: DynamoDBTask }[]

  console.log({ tasks })

  const scrollIntoView = (elem: HTMLElement) => {
    window.scrollTo({
      behavior: 'smooth',
      top:
        elem.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        200,
    })
  }

  const keyActions: KeyAction[] = [
    [
      'ArrowUp',
      'Select previous task',
      (e: KeyboardEvent) => {
        e.preventDefault()
        setSelectedTask(Math.max(selectedTask - 1, 0))
        scrollIntoView(taskElems.current[selectedTask - 1])
      },
    ],
    [
      'ArrowDown',
      'Select next task',
      (e: KeyboardEvent) => {
        e.preventDefault()
        setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1))
        scrollIntoView(taskElems.current[selectedTask + 1])
      },
    ],
    ['Escape', 'Home', () => navigate('/')],
  ]
  useKeyAction(keyActions)

  return (
    <RequireAuth>
      <div className='my-10 mx-5 h-screen'>
        <div className='flex flex-row flex-wrap justify-center pb-2'>
          <Button onClick={() => navigate('/')} icon={HomeIcon} text='Home' />
        </div>
        {tasks.map((task: (typeof tasks)[number], i: number) => (
          <Task
            key={i}
            isSelected={i === selectedTask}
            innerRef={(e: any) => (taskElems.current[i] = e)}
            {...Object.entries(task.M)
              .map(([key, value]) => [key, Object.values(value)[0]])
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})}
            onClick={() => setSelectedTask(i)}
          />
        ))}
      </div>
      <Hints keyActions={keyActions} />
    </RequireAuth>
  )
}

const Task = ({
  due,
  innerRef,
  isSelected,
  repeat,
  repeatInterval,
  repeatUnit,
  showDate,
  strictDeadline,
  timeFrame,
  title,
  onClick,
}: TaskType & {
  innerRef: (x: any) => void
  isSelected: boolean
  showDate: boolean
  onClick: () => void
}) => (
  <div
    ref={innerRef}
    className={
      (isSelected
        ? 'border-gray-600 bg-gray-700'
        : 'border-gray-700 bg-gray-800') +
      ' max-w-96 text-md mx-auto my-1 block rounded border p-4 text-center font-bold text-white drop-shadow-sm md:max-w-sm'
    }
    onClick={onClick}>
    <span>{title}</span>
    {showDate && due !== undefined && due !== 'No Due Date' && (
      <DateTag due={due} />
    )}
    <TimeFrame timeFrame={timeFrame} />
    <Repeat {...{ repeat, repeatInterval, repeatUnit }} />
    {due !== undefined && due !== 'No Due Date' && (
      <Strict strictDeadline={strictDeadline} dueDate={due} />
    )}
  </div>
)

export default History
