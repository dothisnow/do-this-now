import { FireIcon, HeartIcon } from '@heroicons/react/20/solid'
import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'

const Progress = ({ nextIncrease = 0 }: { nextIncrease?: number }) => {
  const progress = useQueryProgressToday()

  if (progress.data === undefined) return <></>

  const { done, lives, streak, streakIsActive, todo } = progress.data

  const livesUsed = Math.min(lives, todo - done)

  return (
    <div className='flex justify-center'>
      <div className='mb-2 flex flex-col items-center gap-1 text-xs'>
        <div className='flex w-full justify-around gap-2'>
          <div
            title={`${
              streakIsActive ? 'Active' : 'Inactive'
            } ${streak} day streak`}
            className='flex text-gray-300'>
            <FireIcon
              className={
                'block h-4 w-4 ' + (streakIsActive ? 'text-amber-500' : '')
              }
            />
            {streak}
          </div>

          <div className='flex text-gray-300'>
            <HeartIcon
              className={
                'block h-4 w-4 ' + (done >= todo ? 'text-red-400' : '')
              }
            />{' '}
            {minutesToHours(lives - livesUsed)}{' '}
          </div>

          {done + livesUsed < todo && (
            <div className='text-gray-300'>
              {minutesToHours(todo - done - livesUsed)} left
            </div>
          )}

          {done + livesUsed >= todo && done < todo && (
            <div className='text-gray-300'>
              {minutesToHours(todo - done)} to{' '}
              <HeartIcon className='inline-block h-4 w-4 text-red-400' />
            </div>
          )}
        </div>

        <div
          style={{
            width: Math.round((144 * todo) / 600),
          }}
          className='relative mt-0.5 h-2 overflow-hidden rounded-full border border-gray-700'>
          {done + livesUsed < todo ? (
            <>
              <div
                className='h-full rounded-full bg-amber-500'
                style={{
                  width:
                    Math.min(
                      ((done + livesUsed + nextIncrease) / todo) * 100,
                      100
                    ) + '%',
                }}
              />
              <div
                className='-mt-1.5 h-full rounded-full bg-gray-500'
                style={{
                  width: Math.min(((done + livesUsed) / todo) * 100, 100) + '%',
                }}
              />
            </>
          ) : (
            <>
              <div
                className='h-full rounded-full bg-gray-500'
                style={{
                  width: Math.min(((done + livesUsed) / todo) * 100, 100) + '%',
                }}
              />
              <div
                className='-mt-1.5 h-full rounded-full bg-amber-500'
                style={{
                  width:
                    Math.min(((done + nextIncrease) / todo) * 100, 100) + '%',
                }}
              />
            </>
          )}
          <div
            className='-mt-1.5 h-full rounded-full bg-white'
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
