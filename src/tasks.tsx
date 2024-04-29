import {
  faArrowDown,
  faCheckCircle,
  faHome,
  faPen,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { Fragment, MutableRefObject, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from './components/button'
import Hints from './components/hints'
import { Loading } from './components/loading'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'
import { TaskBox } from './components/taskbox'
import { newSafeDate } from './helpers/dates'
import useDing from './hooks/useDing'
import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasks } from './hooks/useQueryTasks'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState(0)
  const [sort, setSort] = useState<'CHRON' | 'TOP'>('CHRON')
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const ding = useDing()
  const navigate = useLocation()[1]

  const { data, isFetching } = useQueryTasks()
  const { data: dataTop, isFetching: isFetchingTop } = useQueryTasksTop()

  const tasks = (sort === 'CHRON' ? data?.Items : dataTop) ?? []

  const doneMutation = useQueryTaskDone()
  const deleteMutation = useQueryTaskDelete()

  const completeTask = () => {
    ding()
    doneMutation.mutate(tasks[selectedTask])
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
      action: () => setSort(s => (s === 'CHRON' ? 'TOP' : 'CHRON')),
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
        ) && deleteMutation.mutate(tasks[selectedTask]),
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

  if (sort === 'CHRON')
    tasks.sort((a: (typeof tasks)[number], b: (typeof tasks)[number]) =>
      a.due === 'No Due Date'
        ? -1
        : b.due === 'No Due Date'
        ? 1
        : newSafeDate(a.due).getTime() - newSafeDate(b.due).getTime()
    )

  const firstTaskDueAfterToday = tasks.findIndex(
    (task: (typeof tasks)[number]) => newSafeDate(task.due) > new Date()
  )
  const firstSnoozedTask = tasks.findIndex(
    (task: (typeof tasks)[number]) =>
      task.snooze && new Date(task.snooze) > new Date()
  )

  return (
    <RequireAuth>
      <div className='my-10 mx-5 flex h-screen flex-col items-center gap-1'>
        <Progress />
        <div className='mt-2 flex flex-row flex-wrap justify-center'>
          <Button onClick={() => navigate('/')} icon={faHome} text='Home' />
          <Button
            onClick={() => navigate('/new-task')}
            icon={faPlusCircle}
            text='New Task'
          />
          <Button
            onClick={() => setSort(s => (s === 'CHRON' ? 'TOP' : 'CHRON'))}
            icon={faArrowDown}
            text='Toggle Order'
          />
        </div>
        {tasks.map((task: (typeof tasks)[number], i: number) => {
          const previousTask = i > 0 ? tasks[i - 1] : undefined
          return (
            <Fragment key={task.title}>
              {sort === 'CHRON' && (
                <>
                  {(previousTask === undefined ||
                    formatDate(newSafeDate(previousTask.due)) !==
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
              {sort === 'TOP' && i === firstTaskDueAfterToday && (
                <div className='text-center text-sm text-white md:max-w-sm'>
                  Due after today
                </div>
              )}
              {sort === 'TOP' && i === firstSnoozedTask && (
                <div className='text-center text-sm text-white md:max-w-sm'>
                  Snoozed
                </div>
              )}
              <TaskBox
                innerRef={(e: HTMLButtonElement) => (taskElems.current[i] = e)}
                isSelected={i === selectedTask}
                onClick={() => setSelectedTask(i)}
                task={task}
              />
              {i === selectedTask && (
                <div className='flex flex-row flex-wrap justify-center py-2'>
                  {[
                    {
                      text: 'Complete',
                      icon: faCheckCircle,
                      onClick: completeTask,
                      loading:
                        doneMutation.isLoading &&
                        doneMutation.variables === task,
                    },
                    {
                      text: 'Update',
                      icon: faPen,
                      onClick: () =>
                        navigate(
                          `/update-task/${encodeURIComponent(task.title)}`
                        ),
                    },
                    {
                      text: 'Delete',
                      icon: faTrash,
                      onClick: () =>
                        window.confirm(
                          `Are you sure you want to delete '${task.title}'?`
                        ) && deleteMutation.mutate(task),
                      loading:
                        deleteMutation.isLoading &&
                        deleteMutation.variables === task,
                    },
                  ].map(props => (
                    <Button key={props.text} {...props} />
                  ))}
                </div>
              )}
            </Fragment>
          )
        })}
        {((sort === 'CHRON' && isFetching) ||
          (sort === 'TOP' && isFetchingTop)) && <Loading />}
      </div>
      <Hints keyActions={keyActions} />
    </RequireAuth>
  )
}

export default Tasks
