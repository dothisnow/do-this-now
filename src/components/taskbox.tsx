import { DateTag, Repeat, Strict, TimeFrame } from './tags'

// types
import { Task } from '../types/task'

export const TaskBox = ({
  className,
  onClick,
  showSubtask: propsShowSubtask,
  task,
  title,
}: {
  className?: string
  onClick?: () => void
  showSubtask?: boolean
  task: Task
  title?: string
}) => {
  const showSubtask = propsShowSubtask && task?.subtasks?.length > 0
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
      onClick={onClick}
      className={
        'py-auto text-md mx-5 mt-2 rounded border border-gray-700 bg-gray-800 p-4 text-center font-bold text-white outline-none ring-white ring-offset-0 ring-offset-black drop-shadow-sm focus:z-10 focus:ring md:mx-auto md:max-w-sm md:p-5 ' +
        className
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
