import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'

const Progress = () => {
  const progress = useQueryProgressToday()

  if (progress.data === undefined) return <></>

  const { done, streak, streakIsActive, todo } = progress.data

  return (
    <div className='mb-2 flex flex-col items-center'>
      {streak > 0 && (
        <div className='text-xs font-bold leading-3 text-gray-300'>
          Streak:{' '}
          {streakIsActive ? (
            (streak > 0 && streak <= 3 ? '🔥'.repeat(streak) : streak) +
            (streak > 3 ? '🔥' : '')
          ) : (
            <span className='grayscale'>🔥</span>
          )}
        </div>
      )}
      <div className='text-xs font-bold leading-3 text-gray-300'>
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
        className='mt-0.5 h-2 overflow-hidden rounded-full border border-gray-700 bg-gray-800'>
        <div
          className='h-full rounded-full bg-white'
          style={{
            width: Math.min((done / todo) * 100, 100) + '%',
          }}
        />
      </div>
    </div>
  )
}

export default Progress
