import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'
import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryUpdateTask } from './hooks/useQueryUpdateTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'
import { newSafeDate } from './helpers/dates'
import { RepeatOption, RepeatUnit, RepeatWeekdays, SubTask } from './types/task'

const UpdateTask = () => {
  const { pathname } = useLocation()

  const navigate = useNavigate()

  const taskId = (() => {
    const path = pathname.split('/')
    let lastPathItem = path.pop()
    if (lastPathItem === '') lastPathItem = path.pop()
    if (lastPathItem === 'update-task') navigate(-1)
    if (!lastPathItem) return ''
    return decodeURIComponent(lastPathItem)
  })()

  if (taskId === '') navigate(-1)

  const titleState = useState(taskId)

  const [oldTask, setOldTask] = useState(null)
  const { data, isFetching: isTaskLoading } = useQueryGetTask(taskId)
  const task = data?.Item ?? undefined

  const [loading, setLoading] = useState(false)

  const dueMonthState = useState(1)
  const dueDayState = useState(1)
  const dueYearState = useState(1998)
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

  useEffect(() => {
    if (task && task !== oldTask) {
      dueMonthState[1](newSafeDate(task.due).getMonth() + 1)
      dueDayState[1](newSafeDate(task.due).getDate())
      dueYearState[1](newSafeDate(task.due).getFullYear())
      strictDeadlineState[1](task.strictDeadline)
      repeatState[1](task.repeat)
      repeatIntervalState[1](task.repeatInterval)
      repeatUnitState[1](task.repeatUnit)
      repeatWeekdaysState[1](task.repeatWeekdays)
      timeFrameState[1](task.timeFrame)
      subtasksState[1](task.subtasks)
      setOldTask(task)
    }
  }, [
    dueDayState,
    dueMonthState,
    dueYearState,
    oldTask,
    repeatState,
    repeatIntervalState,
    repeatUnitState,
    repeatWeekdaysState,
    strictDeadlineState,
    subtasksState,
    timeFrameState,
    task,
  ])

  const { mutate } = useQueryUpdateTask()

  const submitForm = () => {
    setLoading(true)
    const task = {
      title: titleState[0],
      due: `${dueYearState[0]}-${dueMonthState[0]}-${dueDayState[0]}`,
      strictDeadline: strictDeadlineState[0],
      repeat: repeatState[0],
      repeatInterval: repeatIntervalState[0],
      repeatUnit: repeatUnitState[0],
      repeatWeekdays: repeatWeekdaysState[0],
      timeFrame: timeFrameState[0],
      ...((subtasksState?.[0]?.length ?? 0) > 0
        ? { subtasks: subtasksState[0] }
        : {}),
      ...(taskId !== titleState[0] ? { oldTitle: taskId } : {}),
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
    ['Escape', 'Back', () => navigate(-1)],
  ]
  useKeyAction(keyActions)

  return (
    <RequireAuth>
      {(loading && isTaskLoading) || !task ? (
        <div className='absolute top-0 left-0 right-0 bottom-0 flex h-screen flex-col justify-center bg-gray-800 opacity-90'>
          <Loading light={false} />
        </div>
      ) : (
        <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
          <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
            <div>
              <div>
                <h3 className='text-lg font-medium leading-6 '>
                  <button
                    onClick={() => navigate(-1)}
                    className='ml-1 mb-1 mr-2 block inline-block rounded-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white hover:border-gray-600 hover:bg-gray-700'>
                    <ChevronLeftIcon className='inline-block h-5 w-5' />
                  </button>
                  <span>Update Task: {taskId}</span>
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
      )}
    </RequireAuth>
  )
}

export default UpdateTask
