import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

export const useQueryTasks = () =>
  useQuery(
    ['tasks'],
    () => {
      return API.get('tasks', '/tasks', {}).catch(console.error)
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
