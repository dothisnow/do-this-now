import ago from 's-ago'
import { useNow } from '../hooks/useNow'

type Timestamp = number

export const LastUpdated = ({ at }: { at: Timestamp }) => {
  const now = useNow()
  return (
    <div className='flex items-center gap-2 text-xs text-gray-700'>
      <div className='w-1'>
        {now - at < 800 && (
          <div className='h-1 w-1 animate-ping rounded-full bg-gray-400 opacity-75' />
        )}
      </div>
      Last updated {ago(new Date(at))}
    </div>
  )
}
