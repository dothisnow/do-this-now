import { useState } from 'react'
import { useLocation } from 'wouter'

import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryUpdateTask } from './hooks/useQueryUpdateTask'

import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import Button from './components/button'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'
import { newSafeDate } from './helpers/dates'
import { SubTask, Task, TaskInput } from './types/task'

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

  const { data, isFetching: isTaskLoading } = useQueryGetTask(taskId)
  const task = data ?? undefined

  const [loading, setLoading] = useState(false)
  const subtasksState = useState<SubTask[]>([])

  const { mutate } = useQueryUpdateTask()

  const keyActions: KeyAction[] = [
    {
      key: 'escape',
      description: 'Back',
      action: () => window.history.back(),
    },
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
              <div className='flex'>
                <Button
                  onClick={() => window.history.back()}
                  icon={ArrowLeftIcon}
                />
                <h3 className='ml-2 pt-1 text-lg font-medium'>
                  Update Task: {taskId}
                </h3>
              </div>
              <TaskForm
                {...task}
                dueMonth={newSafeDate(task.due).getMonth() + 1}
                dueDay={newSafeDate(task.due).getDate()}
                dueYear={newSafeDate(task.due).getFullYear()}
                submitForm={(input: TaskInput) => {
                  setLoading(true)
                  const task: Task = {
                    ...input,
                    ...((subtasksState?.[0]?.length ?? 0) > 0
                      ? { subtasks: subtasksState[0] }
                      : {}),
                    ...(taskId !== input.title[0] ? { oldTitle: taskId } : {}),
                    due: `${input.dueYear}-${input.dueMonth}-${input.dueDay}`,
                  }
                  mutate(task)
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
