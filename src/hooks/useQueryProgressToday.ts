import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { dateString } from '../helpers/dates'

export const progressTodaySchema = z.object({
  done: z.number(),
  lives: z.number(),
  todo: z.number(),
  streak: z.number(),
  streakIsActive: z.boolean(),
})

export const useQueryProgressToday = () => {
  const date = dateString(new Date())
  return useQuery(
    ['progress-today', date],
    async () => {
      return progressTodaySchema.parse(
        await API.get('tasks', '/tasks/progresstoday', {
          queryStringParameters: { date },
        })
      )
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
}
