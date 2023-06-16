import {
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import { newSafeDate } from '../helpers/dates'
import { minutesToHours } from '../helpers/time'

import { DateString, RepeatOption } from '../types/task'

const Tag = ({
  color,
  icon,
  text,
}: {
  color?: `text-${string}`
  icon: typeof CalendarIcon
  text: string
}) => {
  const IconComponent = icon
  return (
    <span
      className={`${
        color ?? 'text-white'
      } ml-1 inline-block rounded-full bg-white bg-opacity-20 p-1 px-2 text-xs`}>
      <div className='flex'>
        <IconComponent className='mt-0.5 mr-1 block h-3.5' />
        <div>{text}</div>
      </div>
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
}: {
  repeat: RepeatOption
  repeatInterval?: number
  repeatUnit?: string
}) => {
  if (repeat === 'No Repeat') return <></>
  if (repeat === 'Custom')
    return (
      <Tag
        icon={ArrowPathIcon}
        text={`${repeatInterval} ${repeatUnit}${repeatInterval !== 0 && 's'}`}
      />
    )
  return <Tag icon={ArrowPathIcon} text={repeat.toLowerCase()} />
}

export const Strict = ({
  dueDate,
  strictDeadline,
}: {
  dueDate: DateString
  strictDeadline?: boolean
}) => {
  if (!strictDeadline) return <></>
  try {
    return (
      <Tag
        icon={ExclamationCircleIcon}
        text='strict'
        color={
          newSafeDate(dueDate) <
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          )
            ? 'text-red-300'
            : newSafeDate(dueDate) <=
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                0,
                0
              )
            ? 'text-orange-300'
            : 'text-white'
        }
      />
    )
  } catch (e) {
    console.error(e)
    return <></>
  }
}
