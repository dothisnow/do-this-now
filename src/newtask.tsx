import { useState } from 'react'

import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'
import { useQueryNewTask } from './hooks/useQueryNewTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'

import { RepeatOption, RepeatUnit, RepeatWeekdays, SubTask } from './types/task'

const NewTask = () => {
  const [loading, setLoading] = useState(false)

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
  const timeFrameState = useState(15)

  const subtasksState = useState<SubTask[]>([])

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
    ['Escape', 'Home', () => window.history.back()],
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
                <span>New Task</span>
              </h3>
            </div>
            <TaskForm
              {...{
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
