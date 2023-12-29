import { useQueryNewTask } from './hooks/useQueryNewTask'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'

import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button } from './components/button'
import { Task, TaskInput } from './types/task'

const NewTask = () => {
  const { error, isLoading, mutate } = useQueryNewTask()

  console.log({ error })

  return (
    <RequireAuth>
      <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
        {isLoading && (
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
            {!!error && <div className='mt-4 text-red-500'></div>}
            <TaskForm
              errorMessage={
                error !== null
                  ? typeof error === 'object' &&
                    'response' in error &&
                    typeof error.response === 'object' &&
                    !!error.response &&
                    'data' in error.response &&
                    typeof error.response.data === 'string'
                    ? error.response.data
                    : 'Something went wrong, please try again later.'
                  : undefined
              }
              submitForm={(input: TaskInput) => {
                if (input.title === '') alert('Add a title dumbass.')
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
