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

import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQuerySnoozeTask } from './hooks/useQuerySnoozeTask'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { isSnoozed, useQueryTasksTop } from './hooks/useQueryTasksTop'

import loginManager from './helpers/LoginManager'
import useDing from './helpers/useDing'

import Button from './components/button'
import Hints from './components/hints'
import Loading from './components/loading'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'
import { TaskBox } from './components/taskbox'

// types
import { Task } from './types/task'

const Home = () => {
  const navigate = useLocation()[1]
  const ding = useDing()

  const { data, isLoading } = useQueryTasksTop()

  let tasks = (data?.Items ?? []).filter(t => !isSnoozed(t))
  console.log(tasks)

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

  const subtasksSnoozed =
    selectedTask &&
    selectedTask.hasOwnProperty('subtasks') &&
    Array.isArray(selectedTask.subtasks)
      ? selectedTask.subtasks.reduce(
          (acc: number, cur: (typeof selectedTask.subtasks)[number]) =>
            acc + (cur.snooze && new Date(cur.snooze) >= new Date() ? 1 : 0),
          0
        )
      : 0

  const snoozeTask = () => {
    if (!selectedTask) return
    mutateSnooze({ task: selectedTask })
    if (
      !selectedTask.hasOwnProperty('subtasks') ||
      subtasksSnoozed + 1 >= selectedTask.subtasks.length
    )
      setSelectedTaskIndex(0)
  }

  const snoozeAllSubtasks = () => {
    if (!selectedTask) return
    mutateSnooze({ task: selectedTask, allSubtasks: true })
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
    {
      key: 'd',
      description: 'Task done',
      action: completeTask,
    },
    {
      key: 'h',
      description: 'History',
      action: () => navigate('/history'),
    },
    {
      key: 'l',
      description: 'Logout',
      action: loginManager.signOut,
    },
    {
      key: 'n',
      description: 'New task',
      action: () => navigate('/new-task'),
    },
    {
      key: 's',
      description: 'Snooze task',
      action: snoozeTask,
    },
    {
      key: 't',
      description: 'Tasks',
      action: () => navigate('/tasks'),
    },
    {
      key: 'u',
      description: 'Update task',
      action: () =>
        selectedTask &&
        navigate(`/update-task/${encodeURIComponent(selectedTask.title)}`),
    },
    {
      key: '1',
      description: 'Select first task',
      action: () => setSelectedTaskIndex(0),
    },
    {
      key: '2',
      description: 'Select second task',
      action: () => setSelectedTaskIndex(1),
    },
    {
      key: '3',
      description: 'Select third task',
      action: () => setSelectedTaskIndex(2),
    },
    {
      key: 'backspace',
      description: 'Delete current task',
      action: deleteTask,
    },
  ]
  useKeyAction(keyActions)

  type ButtonTuple = [() => void, string | undefined, typeof CheckCircleIcon]
  const Buttons = () => {
    const info: ButtonTuple[] = [
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

    if (selectedTask && selectedTask.subtasks.length > 0)
      info.splice(2, 0, [snoozeAllSubtasks, 'Snooze all subtasks', BellIcon])

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
                    <TaskBox
                      className={selectedTaskIndex !== i ? 'opacity-20' : ''}
                      onClick={() =>
                        (i === 0 || i === 1 || i === 2) &&
                        setSelectedTaskIndex(i)
                      }
                      showSubtask={selectedTaskIndex === i}
                      task={task}
                      title={`(Shortcut: ${i + 1})`}
                    />
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
