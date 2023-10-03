import {
  ExclamationCircleIcon,
  FireIcon,
  HeartIcon,
} from '@heroicons/react/20/solid'
import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'

const Progress = () => {
  const progress = useQueryProgressToday()

  if (progress.data === undefined) return <></>

  const { done, lives, streak, streakIsActive, todo } = {
    done: 500,
    lives: 100,
    streak: 5,
    streakIsActive: true,
    todo: 560,
  } //progress.data

  return (
    <div className='flex justify-center'>
      <div className='mb-2 flex flex-col items-center rounded border border-gray-700 bg-gray-800 p-2 drop-shadow-sm'>
        <div className='flex text-sm font-bold text-gray-300'>
          {streakIsActive ? (
            <FireIcon className='block h-5 w-5' />
          ) : (
            <ExclamationCircleIcon className='block h-3 w-3' />
          )}{' '}
          {streak}
        </div>

        <div className='flex text-xs font-bold text-gray-300'>
          <HeartIcon className='block h-4 w-4' /> {minutesToHours(lives)} -{' '}
          {minutesToHours(Math.min(lives, todo - done))}
        </div>

        <div className='text-xs font-bold leading-6 text-gray-300'>
          {done - todo > 0
            ? `+ ${minutesToHours(done - todo)}`
            : `${minutesToHours(done)} / ${minutesToHours(todo)}`}
          {/** - end: ${minutesToHours(
                      //   (currentTime.getHours() * 60 +
                      //     currentTime.getMinutes() +
                      //     todo  -
                      //     done) %
                      //     (12 * 60)
                      // )}`}**/}
        </div>
        <div
          style={{
            width: Math.round((144 * todo) / 600),
          }}
          className='mt-0.5 h-2 overflow-hidden rounded-full border border-gray-700'>
          <div
            className='h-full rounded-full bg-white'
            style={{
              width: Math.min((done / todo) * 100, 100) + '%',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Progress
