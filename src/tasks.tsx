import { Fragment, MutableRefObject, useRef, useState } from 'react'
import { useLocation } from 'wouter'

import {
  ArrowDownIcon,
  CheckCircleIcon,
  HomeIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import { newSafeDate } from './helpers/dates'
import useDing from './helpers/useDing'

import { Button } from './components/button'
import Hints from './components/hints'
import Loading from './components/loading'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'

import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasks } from './hooks/useQueryTasks'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'

import { TaskBox } from './components/taskbox'

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState(0)
  const [sort, setSort] = useState(0)
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const ding = useDing()
  const navigate = useLocation()[1]

  const { data, isFetching } = useQueryTasks()
  const { data: dataTop, isFetching: isFetchingTop } = useQueryTasksTop()

  const tasks = (sort === 0 ? data : dataTop)?.Items ?? []

  const { mutate, isLoading: doneIsLoading } = useQueryTaskDone()
  const { mutate: mutateDelete, isLoading: deleteIsLoading } =
    useQueryTaskDelete()

  const completeTask = () => {
    ding()
    mutate(tasks[selectedTask])
  }

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
    {
      key: 'd',
      description: 'Mark task as done',
      action: completeTask,
    },
    {
      key: 'n',
      description: 'New task',
      action: () => navigate('/new-task'),
    },
    {
      key: 'o',
      description: 'Toggle order between date and top',
      action: () => setSort(s => (s + 1) % 2),
    },
    {
      key: 'u',
      description: 'Update task',
      action: () =>
        navigate(
          `/update-task/${encodeURIComponent(tasks[selectedTask].title)}`
        ),
    },
    {
      key: 'up',
      description: 'Select previous task',
      action: () => {
        setSelectedTask(Math.max(selectedTask - 1, 0))
        scrollIntoView(taskElems.current[selectedTask - 1])
      },
    },
    {
      key: 'down',
      description: 'Select next task',
      action: () => {
        setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1))
        scrollIntoView(taskElems.current[selectedTask + 1])
      },
    },
    {
      key: 'Escape',
      description: 'Home',
      action: () => navigate('/'),
    },
    {
      key: 'Backspace',
      description: 'Delete current task',
      action: () =>
        window.confirm(
          `Are you sure you want to delete '${tasks[selectedTask].title}'?`
        ) && mutateDelete(tasks[selectedTask]),
    },
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
      {doneIsLoading || deleteIsLoading ? (
        <div className='flex h-screen flex-col justify-center'>
          <Loading />
        </div>
      ) : (
        <>
          <div className='my-10 mx-5 flex h-screen flex-col items-center gap-1'>
            <Progress />
            <div className='mt-2 flex flex-row flex-wrap justify-center'>
              <Button
                onClick={() => navigate('/')}
                icon={HomeIcon}
                text='Home'
              />
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
                            : 'text-white') + ' text-center text-sm md:max-w-sm'
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
                    <div className='text-center text-sm text-white md:max-w-sm'>
                      Due after today
                    </div>
                  )}
                <TaskBox
                  innerRef={(e: any) => (taskElems.current[i] = e)}
                  isSelected={i === selectedTask}
                  onClick={() => setSelectedTask(i)}
                  task={task}
                />
                {i === selectedTask && (
                  <div className='flex flex-row flex-wrap justify-center py-2'>
                    {[
                      {
                        text: 'Complete',
                        icon: CheckCircleIcon,
                        onClick: completeTask,
                      },
                      {
                        text: 'Update',
                        icon: PencilIcon,
                        onClick: () =>
                          navigate(
                            `/update-task/${encodeURIComponent(task.title)}`
                          ),
                      },
                      {
                        text: 'Delete',
                        icon: TrashIcon,
                        onClick: () =>
                          window.confirm(
                            `Are you sure you want to delete '${task.title}'?`
                          ) && mutateDelete(task),
                      },
                    ].map(props => (
                      <Button key={props.text} {...props} />
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
            {(sort === 0 && isFetching) ||
              (sort === 1 && isFetchingTop && <Loading />)}
          </div>
          <Hints keyActions={keyActions} />
        </>
      )}
    </RequireAuth>
  )
}

export default Tasks
