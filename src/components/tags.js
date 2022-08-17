import {
    ClockIcon,
    ExclamationCircleIcon,
    RefreshIcon,
} from '@heroicons/react/solid'

const Tag = ({ color, icon, text }) => {
    const IconComponent = icon
    return (
        <span
            className={`${
                color ?? 'text-white'
            } inline-block text-xs bg-white bg-opacity-20 rounded p-1 px-1.5 ml-2`}>
            <IconComponent className='h-3.5 inline-block mr-1' />
            <span>{text}</span>
        </span>
    )
}

export const TimeFrame = ({ timeFrame }) => {
    if (!timeFrame) return <></>
    const text =
        timeFrame < 60
            ? `${timeFrame} mins`
            : timeFrame / 60 === 1
            ? '1 hr'
            : `${timeFrame / 60} hrs`
    return <Tag icon={ClockIcon} text={text} />
}

export const Repeat = ({ repeat, repeatInterval, repeatUnit }) => {
    if (repeat === 'No Repeat') return <></>
    if (repeat === 'Custom')
        return (
            <Tag
                icon={RefreshIcon}
                text={`${repeatInterval} ${repeatUnit}${
                    repeatInterval !== 0 && 's'
                }`}
            />
        )
    return <Tag icon={RefreshIcon} text={repeat.toLowerCase()} />
}

export const Strict = ({ dueDate, strictDeadline }) => {
    if (!strictDeadline) return <></>
    return (
        <Tag
            icon={ExclamationCircleIcon}
            text={dueDate}
            color={
                new Date(dueDate) <
                new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    0,
                    0,
                    0
                )
                    ? 'text-red-300'
                    : new Date(dueDate) <=
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
}
