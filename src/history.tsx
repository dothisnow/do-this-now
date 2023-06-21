import { Fragment, MutableRefObject, useRef, useState } from 'react'
import { useLocation } from 'wouter'

import {
  ArrowDownIcon,
  HomeIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import { newSafeDate } from './helpers/dates'

import Button from './components/button'
import Hints from './components/hints'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

import { useHistory } from './hooks/useHistory'
import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'

import { Task as TaskType } from './types/task'

const History = () => {
  const [selectedTask, setSelectedTask] = useState(0)
  const [sort, setSort] = useState(0)
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const navigate = useLocation()[1]

  const { data, isFetching } = useHistory()

  console.log({ data })

  const tasks = data?.Item?.tasks || []

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

  const formatDate = (date: Date) => {
    try {
      return format(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          0,
          0,
          0
        ),
        'EEEE, LLLL do, u'
      )
    } catch (e) {
      console.error(e)
      return date.toDateString()
    }
  }

  if (sort === 0)
    tasks.sort((a: (typeof tasks)[number], b: (typeof tasks)[number]) =>
      a.due === 'No Due Date'
        ? -1
        : b.due === 'No Due Date'
        ? 1
        : newSafeDate(a.due).getTime() - newSafeDate(b.due).getTime()
    )

  return (
    <RequireAuth>
      <div className='my-10 mx-5 h-screen'>
        <div className='flex flex-row flex-wrap justify-center pb-2'>
          <Button onClick={() => navigate('/')} icon={HomeIcon} text='Home' />
          <Button
            onClick={() => navigate('/new-task')}
            icon={PlusCircleIcon}
            text='New Task'
          />
          <Button
            onClick={() => setSort(s => (s + 1) % 2)}
            icon={ArrowDownIcon}
            text='Toggle Order'
          />
        </div>
        {tasks.map((task: (typeof tasks)[number], i: number) => (
          <Fragment key={task.title}>
            {sort === 0 && (
              <>
                {(i === 0 ||
                  formatDate(newSafeDate(tasks[i - 1].due)) !==
                    formatDate(newSafeDate(task.due))) && (
                  <div
                    className={
                      (newSafeDate(task.due) <
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        0,
                        0,
                        0
                      )
                        ? 'text-orange-300'
                        : 'text-white') +
                      ' max-w-96 mx-auto text-center text-sm md:max-w-sm'
                    }>
                    {newSafeDate(task.due).toDateString()}
                  </div>
                )}
              </>
            )}
            {sort === 1 &&
              i > 0 &&
              newSafeDate(task.due) > new Date() &&
              newSafeDate(tasks[i - 1].due) <= new Date() && (
                <div
                  className={
                    'max-w-96 mx-auto text-center text-sm text-white md:max-w-sm'
                  }>
                  Due after today
                </div>
              )}
            <Task
              isSelected={i === selectedTask}
              innerRef={(e: any) => (taskElems.current[i] = e)}
              {...task}
              onClick={() => setSelectedTask(i)}
              showDate={sort === 1}
            />
          </Fragment>
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
