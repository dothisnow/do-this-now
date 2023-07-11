import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { dateString } from '../helpers/dates'
import { dynamoDBTaskSchema as taskSchema } from '../types/task'

const historySchema = z.object({
  date: z.object({ S: z.string() }),
  tasks: z.object({
    L: z.array(
      z.object({
        M: taskSchema,
      })
    ),
  }),
  streakBeforeToday: z.object({ N: z.number() }).optional(),
})

export const useHistory = () => {
  const date = dateString(new Date())
  return useQuery(
    ['get-task', date],
    async () => {
      return historySchema.parse(
        await API.get('tasks', `/tasks/history/${date}`, {})
      )
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )
}
