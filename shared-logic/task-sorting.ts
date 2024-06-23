import { nextDueDate } from './helpers'
import { Task } from './task'

export const sortTasks = (tasks: Task[], today: Date) => {
  const in2Days = new Date(today)
  in2Days.setDate(in2Days.getDate() + 2)

  const sortFlags = [
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

    // if I do this today, I won't have to do it tomorrow
    (t: Task) =>
      'due' in t &&
      new Date(t.due) <= today &&
      (nextDueDate(t) ?? Infinity) >= in2Days,
  ]

  tasks.sort((a, b) => {
    for (const flag of sortFlags) {
      if (flag(a) && !flag(b)) return -1
      if (flag(b) && !flag(a)) return 1
    }
    if ('due' in a && 'due' in b) return a.due.localeCompare(b.due)
    if ('timeFrame' in a && 'timeFrame' in b) {
      if (a.timeFrame === 0) return -1
      if (b.timeFrame === 0) return 1
      return a.timeFrame - b.timeFrame
    }
    return 0
  })
}
