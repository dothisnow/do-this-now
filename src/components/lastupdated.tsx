import ago from 's-ago'

type Timestamp = number

export const LastUpdated = ({
  at,
  isFetching,
}: {
  at: Timestamp
  isFetching: boolean
}) => (
  <div className='flex items-center gap-2 text-xs text-gray-700'>
    {isFetching && (
      <div className='h-1 w-1 animate-ping rounded-full bg-gray-400 opacity-75' />
    )}
    Last updated {ago(new Date(at))}
  </div>
)
