import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { handleGet } from './api'

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
})

export const useHistory = (daysAgo: number = 0) => {
  // daysAgo is 0 for today, 1 for yesterday, etc.
  const date = dateString(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - daysAgo
    )
  )
  return useQuery(['tasks', 'history', date], async () =>
    historySchema.parse(await handleGet({ path: `/tasks/history/${date}` }))
  )
}
