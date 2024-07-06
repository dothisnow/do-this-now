import { nextDueDate } from './helpers'
import { SubTask, Task } from './task'

export const testVar = 1

const subtaskIsSnoozed = (s: SubTask) =>
  s.snooze && new Date(s.snooze) >= new Date()

export const isSnoozed = (t: Task) =>
  (t.snooze && new Date(t.snooze) >= new Date()) ||
  (t.subtasks &&
    t.subtasks.length > 0 &&
    !t.subtasks.some(s => !s.done && !subtaskIsSnoozed(s)))

export const sortTasks = (tasks: Task[], today: Date) => {
  const tmrw = new Date(today)
  tmrw.setDate(tmrw.getDate() + 1)
  const in2Days = new Date(today)
  in2Days.setDate(in2Days.getDate() + 2)

  const sortFlags = [
    // snoozed
    (t: Task) => !isSnoozed(t),

    // due today or past due
    (t: Task) => 'due' in t && new Date(t.due) <= today,

    // strict deadline and due today or past due
    (t: Task) =>
      'due' in t &&
      'strictDeadline' in t &&
      new Date(t.due) <= today &&
      t.strictDeadline,

    // has not been done today
    // t =>
    //   !t.hasOwnProperty('history') ||
    //   t.history.filter(d => d === dateString(today)).length === 0,

    // if I do this task, I won't have to do again it tomorrow
    (t: Task) =>
      'due' in t &&
      new Date(t.due) <= today &&
      (nextDueDate(t) ?? Infinity) >= in2Days,

    // if I do this task, I won't have to do again today
    (t: Task) =>
      'due' in t &&
      new Date(t.due) <= today &&
      (nextDueDate(t) ?? Infinity) >= tmrw,
  ]

  tasks.sort((a, b) => {
    for (const flag of sortFlags) {
      if (flag(a) && !flag(b)) return -1
      if (flag(b) && !flag(a)) return 1
    }
    if ('due' in a && 'due' in b && a.due.localeCompare(b.due) !== 0)
      return a.due.localeCompare(b.due)
    if ('timeFrame' in a && 'timeFrame' in b) {
      // tasks that take no time should go last
      if (a.timeFrame === b.timeFrame) return 0
      if (a.timeFrame === 0) return 1
      if (b.timeFrame === 0) return -1
      return a.timeFrame - b.timeFrame
    }
    return 0
  })
}
