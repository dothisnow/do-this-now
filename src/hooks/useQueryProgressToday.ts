import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { dateString } from '../shared-logic/helpers'
import { handleGet } from './api'

const progressTodaySchema = z.object({
  done: z.number(),
  lives: z.number(),
  todo: z.number(),
  streak: z.number(),
  streakIsActive: z.boolean(),
})

export const useQueryProgressToday = () => {
  const date = dateString(new Date())
  return useQuery(['tasks', 'progresstoday', date], async () =>
    progressTodaySchema.parse(
      await handleGet({ path: '/tasks/progresstoday', queryParams: { date } })
    )
  )
}
