import { minutesToHours } from '../helpers/time'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'

const Progress = () => {
  const { data: progress, isLoading: isLoadingProgress } =
    useQueryProgressToday()

  const tasksDoneToday =
    (progress?.done ?? 0) + (progress?.doneBeforeToday ?? 0)

  if (isLoadingProgress) return <></>
  return (
    <div className='mb-2 flex flex-col items-center'>
      <div className='text-xs font-bold leading-3 text-gray-300'>
        {tasksDoneToday - (progress?.todo ?? 0) > 0
          ? `+ ${minutesToHours(tasksDoneToday - (progress?.todo ?? 10))}`
          : `${minutesToHours(tasksDoneToday)} / ${minutesToHours(
              progress?.todo ?? 10
            )}`}
        {/** - end: ${minutesToHours(
                      //   (currentTime.getHours() * 60 +
                      //     currentTime.getMinutes() +
                      //     (progress?.todo ?? 10) -
                      //     tasksDoneToday) %
                      //     (12 * 60)
                      // )}`}**/}
      </div>
      <div className='mt-0.5 h-2 w-36 overflow-hidden rounded-full border border-gray-700 bg-gray-800'>
        <div
          className='h-full rounded-full bg-white'
          style={{
            width:
              Math.min((tasksDoneToday / (progress?.todo ?? 10)) * 100, 100) +
              '%',
          }}
        />
      </div>
    </div>
  )
}

export default Progress
