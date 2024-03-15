import { FireIcon, HeartIcon } from '@heroicons/react/20/solid'
import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'
import { Tag } from './tags'

const Progress = () => {
  const progress = useQueryProgressToday()

  if (progress.data === undefined) return <></>

  const { done, lives, streak, streakIsActive, todo } = progress.data

  const livesUsed = Math.min(lives, todo - done)

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col items-center gap-1 text-xs font-light'>
        <div className='flex w-full justify-center gap-5 text-white'>
          <Tag
            icon={FireIcon}
            text={'' + streak}
            color={streakIsActive ? 'text-amber-500' : ''}
          />

          <Tag
            icon={HeartIcon}
            text={'' + minutesToHours(lives - livesUsed)}
            color={done >= todo ? 'text-red-400' : ''}
          />

          {done + livesUsed < todo && (
            <Tag text={minutesToHours(todo - done - livesUsed) + ' left'} />
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
          <div
            className='h-full rounded-full bg-gray-500'
            style={{
              width: Math.min(((done + livesUsed) / todo) * 100, 100) + '%',
            }}
          />
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
