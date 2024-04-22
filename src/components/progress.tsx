import { faFire, faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'
import { Tag } from './tags'

const Progress = () => {
  const progress = useQueryProgressToday()

  if (progress.data === undefined) return <></>

  const { done, lives, streak, streakIsActive, todo } = progress.data

  const livesUsed = Math.min(lives, todo - done)
  const livesLeft = lives - livesUsed

  const doneUsingAllLives = Math.min(done, todo - lives)
  const doneUsingLives = Math.min(done, todo)
  const points =
    doneUsingAllLives +
    (doneUsingLives - doneUsingAllLives) * 2 +
    (done - doneUsingLives) * 3

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col items-center gap-1 text-xs font-light'>
        <div className='flex w-full justify-center gap-5 text-white'>
          <Tag icon={faStar} text={'' + points} />
          <Tag
            icon={faFire}
            text={'' + streak}
            color={streakIsActive ? 'text-amber-500' : 'text-white/50'}
          />
        </div>
        <div className='flex w-full justify-center gap-5 text-white'>
          {livesLeft > 0 ? (
            <Tag
              icon={faHeart}
              text={'' + minutesToHours(lives - livesUsed)}
              color={done >= todo ? 'text-red-400' : 'text-white/50'}
            />
          ) : (
            todo - done - livesUsed > 0 && (
              <Tag
                icon={faFire}
                iconRight={true}
                text={minutesToHours(todo - done - livesUsed) + ' to'}
              />
            )
          )}

          {todo - done > 0 && (
            <Tag
              icon={faHeart}
              text={minutesToHours(todo - done) + ' to'}
              iconRight={true}
            />
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
