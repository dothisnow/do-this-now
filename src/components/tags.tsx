import {
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import { newSafeDate } from '../helpers/dates'
import { minutesToHours } from '../helpers/time'

import { DateString, RepeatOption, RepeatWeekdays } from '../types/task'

export const Tag = ({
  icon,
  text,
  color,
}: {
  icon?: typeof CalendarIcon
  text: string
  color?: string
}) => {
  const IconComponent = icon
  return (
    <span className='text-xs font-light'>
      <span className='flex items-center whitespace-nowrap'>
        {IconComponent && (
          <IconComponent className={color + ' mr-1 block h-3.5'} />
        )}
        <div>{text}</div>
      </span>
    </span>
  )
}

export const DateTag = ({ due }: { due: DateString }) => {
  try {
    const dueDate = new Date(due)
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    )
    const tomorrow = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      0,
      0,
      0
    )
    const yesterday = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      0,
      0,
      0
    )
    return (
      <Tag
        text={
          dueDate.getTime() - today.getTime() === 0
            ? 'Today'
            : dueDate.getTime() - tomorrow.getTime() === 0
            ? 'Tomorrow'
            : dueDate.getTime() - yesterday.getTime() === 0
            ? 'Yesterday'
            : format(newSafeDate(due), 'iii LLL d')
        }
        icon={CalendarIcon}
      />
    )
  } catch (e) {
    console.error(e)
    return <></>
  }
}

export const TimeFrame = ({ timeFrame }: { timeFrame?: number }) => {
  if (!timeFrame) return <></>
  return <Tag icon={ClockIcon} text={minutesToHours(timeFrame)} />
}

export const Repeat = ({
  repeat,
  repeatInterval,
  repeatUnit,
  repeatWeekdays,
}: {
  repeat: RepeatOption
  repeatInterval: number
  repeatUnit: string
  repeatWeekdays: RepeatWeekdays
}) => {
  if (repeat === 'No Repeat') return <></>

  if (repeat === 'Custom') {
    let text = ''
    if (repeatUnit === 'week' && repeatWeekdays.some(x => x)) {
      text =
        ': ' +
        repeatWeekdays
          .map((x, i) =>
            x ? ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'][i] : ''
          )
          .filter(x => x)
          .join(', ')
    }
    text =
      (repeatInterval > 1
        ? `${repeatInterval} ${repeatUnit}s`
        : `${repeatUnit}ly`) + text
    return <Tag icon={ArrowPathIcon} text={text.toLowerCase()} />
  }

  return <Tag icon={ArrowPathIcon} text={repeat.toLowerCase()} />
}

export const Strict = ({
  strictDeadline,
}: {
  dueDate: DateString
  strictDeadline?: boolean
  highlight?: boolean
}) => {
  if (!strictDeadline) return <></>
  try {
    return <Tag icon={ExclamationCircleIcon} text='strict' />
  } catch (e) {
    console.error(e)
    return <></>
  }
}
