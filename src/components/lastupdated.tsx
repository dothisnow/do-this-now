import { useEffect, useState } from 'react'
import ago from 's-ago'

type Timestamp = number

const useNow = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return now
}

export const LastUpdated = ({
  at,
  isFetching,
}: {
  at: Timestamp
  isFetching: boolean
}) => {
  useNow()
  return (
    <div className='flex items-center gap-2 text-xs text-gray-700'>
      {isFetching ? 'Checking for updates...' : `Updated ${ago(new Date(at))}`}
    </div>
  )
}
