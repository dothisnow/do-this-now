import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

import { dateString } from '../helpers/dates'

export const useQueryTasksTop = () => {
  const date = dateString(new Date())
  return useQuery(
    ['tasks-top', date],
    async () => {
      return API.get('tasks', '/tasks/top', {
        queryStringParameters: {
          date,
        },
      }).catch(console.error)
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
}