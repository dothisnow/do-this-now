import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

import { dateString } from '../helpers/dates'

export const useHistory = () => {
  const date = dateString(new Date())
  return useQuery(
    ['get-task', date],
    async () => {
      return API.get('tasks', `/tasks/history/${date}`, {}).catch(console.error)
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )
}
