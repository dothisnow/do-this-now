export type DateString = `${number}-${number}-${number}`

export type RepeatOption =
  | 'No Repeat'
  | 'Daily'
  | 'Weekdays'
  | 'Weekly'
  | 'Monthly'
  | 'Yearly'
  | 'Custom'

export type RepeatUnit = 'day' | 'week' | 'month' | 'year'

export type SubTask = {
  title: string
  done: boolean
  skipped?: boolean
}

export type Task = {
  title: string
  dueMonth: number
  dueDay: number
  dueYear: number
  strictDeadline: boolean
  repeat: RepeatOption
  repeatInterval: number
  repeatUnit: RepeatUnit
  selectedWeekDays: [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
  ]
  timeFrame: number
  subtasks: SubTask[]
  done?: boolean
}
