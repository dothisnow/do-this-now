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
    {isFetching ? 'Checking for updates...' : `Updated ${ago(new Date(at))}`}
  </div>
)
