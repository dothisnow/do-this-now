export type DateString = `${number}-${number}-${number}`

export type RepeatOptions =
  | 'No Repeat'
  | 'Daily'
  | 'Weekdays'
  | 'Weekly'
  | 'Monthly'
  | 'Yearly'
  | 'Custom'

export type SubTask = {
  title: string
  done: boolean
  skipped?: boolean
}
