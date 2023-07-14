import {
  BackwardIcon,
  Bars3Icon,
  BellIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useLocation } from 'wouter'

import useKeyAction, { KeyAction, KeyboardEvent } from './hooks/useKeyAction'
import { useQuerySnoozeTask } from './hooks/useQuerySnoozeTask'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'

import loginManager from './helpers/LoginManager'
import useDing from './helpers/useDing'

import Button from './components/button'
import Hints from './components/hints'
import Loading from './components/loading'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

// types
import { Task } from './types/task'

const Home = () => {
  const navigate = useLocation()[1]
  const ding = useDing()

  const { data, isLoading } = useQueryTasksTop()

  let tasks = data?.Items ?? []

  const [selectedTaskIndex, setSelectedTaskIndex] = useState<0 | 1 | 2>(0)
  const selectedTask = !tasks
    ? null
    : tasks.length > selectedTaskIndex
    ? tasks[selectedTaskIndex]
    : tasks[-1]

  if (tasks && tasks.length > 0 && tasks.length <= selectedTaskIndex)
    setSelectedTaskIndex(tasks.length === 2 ? 1 : 0)

  const { mutate, isLoading: doneIsLoading } = useQueryTaskDone()
  const { mutate: mutateDelete, isLoading: deleteIsLoading } =
    useQueryTaskDelete()
  const { mutate: mutateSnooze, isLoading: snoozeIsLoading } =
    useQuerySnoozeTask()

  const subtasksDone =
    selectedTask &&
    selectedTask.hasOwnProperty('subtasks') &&
    Array.isArray(selectedTask.subtasks)
      ? selectedTask.subtasks.reduce(
          (acc: number, cur: (typeof selectedTask.subtasks)[number]) =>
            acc + (cur.done ? 1 : 0),
          0
        )
      : 0

  const completeTask = () => {
    if (!selectedTask) return
    ding()
    mutate(selectedTask)
    if (
      !selectedTask.hasOwnProperty('subtasks') ||
      subtasksDone + 1 >= selectedTask.subtasks.length
    )
      setSelectedTaskIndex(0)
  }

  const snoozeTask = () => {
    if (!selectedTask) return
    mutateSnooze(selectedTask)
    setSelectedTaskIndex(0)
  }

  const deleteTask = () => {
    if (!selectedTask) return
    if (
      !window.confirm(
        `Are you sure you want to delete '${selectedTask.title}'?`
      )
    )
      return
    mutateDelete(selectedTask)
    setSelectedTaskIndex(0)
  }

  const keyActions: KeyAction[] = [
    ['d', 'Task done', completeTask],
    [
      'l',
      'Logout',
      () => window.confirm('You sure?') && loginManager.signOut(),
    ],
    [
      'n',
      'New task',
      (e: KeyboardEvent) => {
        e.preventDefault()
        navigate('/new-task')
      },
    ],
    ['s', 'Snooze task', () => snoozeTask()],
    ['t', 'Tasks', () => navigate('/tasks')],
    [
      'u',
      'Update task',
      () =>
        selectedTask &&
        navigate(`/update-task/${encodeURIComponent(selectedTask.title)}`),
    ],
    ['1', 'Select first task', () => setSelectedTaskIndex(0)],
    ['2', 'Select second task', () => setSelectedTaskIndex(1)],
    ['3', 'Select third task', () => setSelectedTaskIndex(2)],
    ['Backspace', 'Delete current task', () => deleteTask()],
    ['Escape', 'Reset selected task', () => setSelectedTaskIndex(0)],
  ]
  useKeyAction(keyActions)

  const Buttons = () => {
    const info: [() => void, string | undefined, typeof CheckCircleIcon][] = [
      [completeTask, 'Complete', CheckCircleIcon],
      [snoozeTask, 'Snooze', BellIcon],
      [
        () =>
          selectedTask &&
          navigate(`/update-task/${encodeURIComponent(selectedTask.title)}`),
        undefined,
        PencilSquareIcon,
      ],
      [deleteTask, undefined, TrashIcon],
    ]
    return (
      <>
        {info.map(([func, text, icon]) => (
          <Button key={text} onClick={func} text={text} icon={icon} />
        ))}
      </>
    )
  }

  return (
    <RequireAuth>
      <div className='flex h-screen flex-col justify-center'>
        {isLoading || doneIsLoading || deleteIsLoading || snoozeIsLoading ? (
          <Loading />
        ) : (
          <>
            <Progress />
            <div className='mx-5 flex flex-row flex-wrap justify-center pr-2'>
              <Button
                onClick={() => navigate('/tasks')}
                text={'All tasks'}
                icon={Bars3Icon}
              />
              <Button
                onClick={() => navigate('/new-task')}
                text={'New task'}
                icon={PlusCircleIcon}
              />
              <Button
                onClick={() => navigate('/history')}
                text={'History'}
                icon={BackwardIcon}
              />
            </div>
            {tasks.length > 0 ? (
              <>
                {tasks.slice(0, 3).map((task: Task, i: number) => (
                  <>
                    <button
                      onClick={() =>
                        (i === 0 || i === 1 || i === 2) &&
                        setSelectedTaskIndex(i)
                      }
                      className={
                        'py-auto text-md mx-5 mt-2 rounded border border-gray-700 bg-gray-800 p-4 text-center font-bold text-white drop-shadow-sm md:mx-auto md:max-w-sm md:p-5 ' +
                        (selectedTaskIndex !== i ? ' opacity-20' : '')
                      }
                      title={`(Shortcut: ${i + 1})`}>
                      <div>
                        <span>
                          {selectedTaskIndex === i &&
                          task.hasOwnProperty('subtasks') &&
                          task.subtasks.length > 0 &&
                          task.subtasks.some(
                            (s: (typeof task.subtasks)[number]) => !s.done
                          )
                            ? task.subtasks.find(
                                (s: (typeof task.subtasks)[number]) => !s.done
                              )?.title ?? task.title
                            : task.title}
                        </span>
                      </div>
                      {selectedTaskIndex === i &&
                        task.hasOwnProperty('subtasks') &&
                        task.subtasks.length > 0 && (
                          <div className='py-1 text-xs font-normal'>
                            {task.title} ({subtasksDone}/{task.subtasks.length})
                          </div>
                        )}
                      <div>
                        <DateTag due={task.due} />
                        <TimeFrame timeFrame={task.timeFrame} />
                        <Repeat
                          repeat={task.repeat}
                          repeatInterval={task.repeatInterval}
                          repeatUnit={task.repeatUnit}
                          repeatWeekdays={task.repeatWeekdays}
                        />
                        <Strict
                          strictDeadline={task.strictDeadline}
                          dueDate={task.due}
                        />
                      </div>
                    </button>
                    {selectedTaskIndex === i && (
                      <div className='mx-5 flex flex-row flex-wrap justify-center pt-2 pr-2'>
                        <Buttons />
                      </div>
                    )}
                  </>
                ))}
              </>
            ) : (
              'No tasks'
            )}
          </>
        )}
        <Hints keyActions={keyActions} />
      </div>
    </RequireAuth>
  )
}

export default Home
