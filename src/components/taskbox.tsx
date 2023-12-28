import { DateTag, Repeat, Strict, TimeFrame } from './tags'

// types
import { Task } from '../types/task'

export const TaskBox = ({
  innerRef,
  isSelected,
  onClick,
  task,
  title,
}: {
  innerRef?: (x: any) => void
  isSelected: boolean
  onClick?: () => void
  task: Task
  title?: string
}) => {
  const showSubtask = isSelected && task?.subtasks?.length > 0
  const subtasksDone =
    task.hasOwnProperty('subtasks') && Array.isArray(task.subtasks)
      ? task.subtasks.reduce(
          (acc: number, cur: (typeof task.subtasks)[number]) =>
            acc + (cur.done ? 1 : 0),
          0
        )
      : 0
  return (
    <button
      ref={innerRef}
      onClick={onClick}
      className={
        (isSelected
          ? 'border-gray-600 bg-gray-700 '
          : 'border-gray-700 bg-gray-800 ') +
        'text-md w-full max-w-sm rounded-lg border p-4 text-center font-bold text-white outline-none ring-white ring-offset-0 ring-offset-black drop-shadow-sm focus:z-10 focus:ring md:p-5 '
      }
      title={title}>
      <div>
        <span>
          {showSubtask
            ? task?.subtasks?.find(
                (s: (typeof task.subtasks)[number]) =>
                  !s.done && (!s.snooze || new Date(s.snooze) < new Date())
              )?.title ?? task.title
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
