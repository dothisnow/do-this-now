import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { taskSchema } from '../types/task'

export const tasksSchema = z.object({
  Items: z.array(taskSchema),
  Count: z.number(),
  ScannedCount: z.number(),
})

export const useQueryTasks = () =>
  useQuery(
    ['tasks'],
    async () => {
      return tasksSchema.parse(await API.get('tasks', '/tasks', {}))
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
