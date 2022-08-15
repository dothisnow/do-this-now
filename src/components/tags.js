import {
    ClockIcon,
    ExclamationCircleIcon,
    RefreshIcon,
} from '@heroicons/react/solid'

const Tag = ({ icon, text }) => {
    const IconComponent = icon
    return (
        <span className='text-white inline-block text-xs bg-white bg-opacity-20 rounded p-1 px-1.5 ml-2'>
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

export const Repeat = ({ repeat }) => {
    if (repeat === 'No Repeat') return <></>
    return <Tag icon={RefreshIcon} text={repeat.toLowerCase()} />
}

export const Strict = ({ strictDeadline }) => {
    if (!strictDeadline) return <></>
    return <Tag icon={ExclamationCircleIcon} text='strict' />
}
