import { useState } from 'react'

import { useQueryNewTask } from './hooks/useQueryNewTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'

import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button } from './components/button'
import { Task, TaskInput } from './types/task'

const NewTask = () => {
  const [loading, setLoading] = useState(false)
  const { mutate } = useQueryNewTask()

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
            <div className='flex'>
              <Button
                onClick={() => window.history.back()}
                icon={ArrowLeftIcon}
              />
              <h3 className='ml-2 pt-1 text-lg font-medium'>New Task</h3>
            </div>
            <TaskForm
              submitForm={(input: TaskInput) => {
                setLoading(true)
                if (input.title === '') {
                  alert('Add a title dumbass.')
                  return setLoading(false)
                }
                const task: Task = {
                  ...input,
                  due: `${input.dueYear}-${input.dueMonth}-${input.dueDay}`,
                }
                mutate(task)
              }}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

export default NewTask
