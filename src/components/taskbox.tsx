import { DateTag, Repeat, Strict, TimeFrame } from './tags'

// types
import { LegacyRef } from 'react'
import { Task } from '../types/task'

export const TaskBox = ({
  innerRef,
  isSelected,
  onClick,
  task,
  title,
}: {
  innerRef?: LegacyRef<HTMLButtonElement>
  isSelected: boolean
  onClick?: () => void
  task: Task
  title?: string
}) => {
  const showSubtask = isSelected && task?.subtasks?.length > 0
  const subtasksDone =
    'subtasks' in task && Array.isArray(task.subtasks)
      ? task.subtasks.reduce(
          (acc: number, cur: (typeof task.subtasks)[number]) =>
            acc + (cur.done ? 1 : 0),
          0
        )
      : 0
  return (
    <button
      onClick={onClick}
      className={
        (isSelected
          ? 'border-gray-600 bg-gray-700 '
          : 'border-gray-700 bg-gray-800 ') +
        'text-md w-full max-w-sm rounded-lg border p-4 text-center font-bold text-white outline-none ring-white ring-offset-0 ring-offset-black drop-shadow-sm focus:z-10 focus:ring md:p-5 '
      }
      title={title}
      {...(innerRef !== null ? { ref: innerRef } : {})}>
      <div>
        <span>
          {showSubtask
            ? // show the first unsnoozed subtask
              task?.subtasks?.find(
                (s: (typeof task.subtasks)[number]) =>
                  !s.done && (!s.snooze || new Date(s.snooze) < new Date())
              )?.title ??
              // if there are none, show the first subtask that isn't done
              task?.subtasks?.find(
                (s: (typeof task.subtasks)[number]) => !s.done
              )?.title ??
              // otherwise, just show the task title
              task.title
            : task.title}
        </span>
      </div>
      {showSubtask && (
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
        <Strict strictDeadline={task.strictDeadline} dueDate={task.due} />
      </div>
    </button>
  )
}
