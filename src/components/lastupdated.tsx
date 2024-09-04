import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import ago from 's-ago'
import useKeyAction from '../hooks/useKeyAction'

const useNow = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return now
}

export const LastUpdated = ({
  query,
}: {
  query: ReturnType<typeof useQuery>
}) => {
  useNow()
  useKeyAction([
    {
      key: 'r',
      action: () => query.refetch(),
      description: 'Refresh',
    },
  ])
  return (
    <button
      onClick={() => query.refetch()}
      className='group flex items-center gap-2 text-xs text-gray-700'>
      {query.isFetching
        ? 'Checking for updates...'
        : `Updated ${ago(new Date(query.dataUpdatedAt))}`}
      {!query.isFetching && (
        <span className='hidden underline group-hover:inline'>Refresh</span>
      )}
    </button>
  )
}
