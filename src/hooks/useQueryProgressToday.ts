import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

import { dateString } from '../helpers/dates'

export const useQueryProgressToday = () => {
  const date = dateString(new Date())
  return useQuery(
    ['progress-today', date],
    async () => {
      return API.get('tasks', '/tasks/progresstoday', {
        queryStringParameters: { date },
      }).catch(console.error)
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
}
