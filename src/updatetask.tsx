import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'
import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryUpdateTask } from './hooks/useQueryUpdateTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'
import { newSafeDate } from './helpers/dates'
import {
  RepeatOption,
  RepeatUnit,
  RepeatWeekdays,
  SubTask,
  Task,
} from './types/task'

const UpdateTask = () => {
  const [location] = useLocation()

  const taskId = (() => {
    const path = location.split('/')
    let lastPathItem = path.pop()
    if (lastPathItem === '') lastPathItem = path.pop()
    if (lastPathItem === 'update-task') window.history.back()
    if (!lastPathItem) return ''
    return decodeURIComponent(lastPathItem)
  })()

  const titleState = useState(taskId)

  const [oldTask, setOldTask] = useState<Task>()
  const { data, isFetching: isTaskLoading } = useQueryGetTask(taskId)
  const task = data ?? undefined

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
    ['Escape', 'Back', () => window.history.back()],
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
