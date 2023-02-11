import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'
import { useQueryNewTask } from './hooks/useQueryNewTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'

import { RepeatOption, RepeatUnit, RepeatWeekdays, SubTask } from './types/task'

const NewTask = () => {
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(true)

  const titleState = useState('')

  const dueMonthState = useState(new Date().getMonth() + 1)
  const dueDayState = useState(new Date().getDate())
  const dueYearState = useState(new Date().getFullYear())

  const strictDeadlineState = useState(false)

  const repeatState = useState<RepeatOption>('No Repeat')
  const repeatIntervalState = useState(1)
  const repeatUnitState = useState<RepeatUnit>('day')
  const repeatWeekdaysState = useState<RepeatWeekdays>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ])
  const toggleWeekday = (i: 0 | 1 | 2 | 3 | 4 | 5 | 6) =>
    repeatWeekdaysState[1](s => [
      i === 0 ? !s[0] : s[0],
      i === 1 ? !s[1] : s[1],
      i === 2 ? !s[2] : s[2],
      i === 3 ? !s[3] : s[3],
      i === 4 ? !s[4] : s[4],
      i === 5 ? !s[5] : s[5],
      i === 6 ? !s[6] : s[6],
    ])
  const timeFrameState = useState(15)

  const subtasksState = useState<SubTask[]>([])

  const navigate = useNavigate()

  const { mutate } = useQueryNewTask()

  const submitForm = () => {
    setLoading(true)
    if (titleState[0] === '') {
      alert('Add a title dumbass.')
      return setLoading(false)
    }
    const dueString: `${number}-${number}-${number}` = `${dueYearState[0]}-${dueMonthState[0]}-${dueDayState[0]}`
    const task = {
      title: titleState[0],
      due: dueString,
      strictDeadline: strictDeadlineState[0],
      repeat: repeatState[0],
      repeatInterval: repeatIntervalState[0],
      repeatUnit: repeatUnitState[0],
      repeatWeekdays: repeatWeekdaysState[0],
      timeFrame: timeFrameState[0],
      subtasks: subtasksState[0],
    }
    mutate(task)
  }

  const keyActions: KeyAction[] = [
    [
      'Enter',
      'Submit form',
      (e: KeyboardEvent) => {
        e.preventDefault()
        e.stopPropagation()
        submitForm()
      },
    ],
    ['Escape', 'Home', () => navigate('/')],
    ['u', 'Toggle Sunday', () => !isTyping && toggleWeekday(0)],
    ['m', 'Toggle Monday', () => !isTyping && toggleWeekday(1)],
    ['t', 'Toggle Tuesday', () => !isTyping && toggleWeekday(2)],
    ['w', 'Toggle Wednesday', () => !isTyping && toggleWeekday(3)],
    ['r', 'Toggle Thursday', () => !isTyping && toggleWeekday(4)],
    ['f', 'Toggle Friday', () => !isTyping && toggleWeekday(5)],
    ['s', 'Toggle Saturday', () => !isTyping && toggleWeekday(6)],
  ]
  useKeyAction(keyActions)

  return (
    <RequireAuth>
      <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
        {loading && (
          <div className='fixed top-0 left-0 right-0 bottom-0 flex h-screen flex-col justify-center bg-gray-800 opacity-90'>
            <Loading light={false} />
          </div>
        )}
        <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
          <div>
            <div>
              <h3 className='text-lg font-medium leading-6 '>
                <ChevronLeftIcon
                  className='inline-block h-5 w-5 cursor-pointer md:hidden'
                  onClick={() => navigate(-1)}
                />
                <span>New Task</span>
              </h3>
            </div>
            <TaskForm
              {...{
                setIsTyping,
                titleState,
                dueMonthState,
                dueDayState,
                dueYearState,
                strictDeadlineState,
                repeatState,
                repeatIntervalState,
                repeatUnitState,
                repeatWeekdaysState,
                timeFrameState,
                subtasksState,
                submitForm,
              }}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default NewTask
