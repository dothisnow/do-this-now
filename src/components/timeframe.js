import { ClockIcon } from '@heroicons/react/solid'

const TimeFrame = ({ timeFrame }) => {
    if (!timeFrame) return <></>
    const text =
        timeFrame < 60
            ? `${timeFrame} mins`
            : timeFrame / 60 === 1
            ? '1 hr'
            : `${timeFrame / 60} hrs`
    return (
        <span className='text-white inline-block text-xs bg-white bg-opacity-20 rounded p-1 px-1.5 ml-2'>
            <ClockIcon className='h-3.5 inline-block mr-1' />
            <span>{text}</span>
        </span>
    )
}

export default TimeFrame
