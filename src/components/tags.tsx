import {
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from '@heroicons/react/solid'
import { format } from 'date-fns'
import { FC } from 'react'

import { newSafeDate } from '../helpers/dates'

import { DateString, RepeatOptions } from '../types/task'

const Tag = ({
  color,
  icon,
  text,
}: {
  color?: `text-${string}`
  icon: FC<{ className: string }>
  text: string
}) => {
  const IconComponent = icon
  return (
    <span
      className={`${
        color ?? 'text-white'
      } ml-2 inline-block rounded bg-white bg-opacity-20 p-1 px-1.5 text-xs`}>
      <IconComponent className='mr-1 inline-block h-3.5' />
      <span>{text}</span>
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
  const text =
    timeFrame < 60
      ? `${timeFrame} mins`
      : timeFrame / 60 === 1
      ? '1 hr'
      : `${timeFrame / 60} hrs`
  return <Tag icon={ClockIcon} text={text} />
}

export const Repeat = ({
  repeat,
  repeatInterval,
  repeatUnit,
}: {
  repeat: RepeatOptions
  repeatInterval?: number
  repeatUnit?: string
}) => {
  if (repeat === 'No Repeat') return <></>
  if (repeat === 'Custom')
    return (
      <Tag
        icon={RefreshIcon}
        text={`${repeatInterval} ${repeatUnit}${repeatInterval !== 0 && 's'}`}
      />
    )
  return <Tag icon={RefreshIcon} text={repeat.toLowerCase()} />
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
