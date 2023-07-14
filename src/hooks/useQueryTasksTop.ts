import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { dateString } from '../helpers/dates'

// types
import { taskSchema } from '../types/task'

export const tasksSchema = z.object({
  Items: z.array(taskSchema),
  Count: z.number(),
  ScannedCount: z.number(),
})

export const useQueryTasksTop = () => {
  const date = dateString(new Date())
  return useQuery(
    ['tasks-top', date],
    async () => {
      const tasks = tasksSchema.parse(
        await API.get('tasks', '/tasks/top', {
          queryStringParameters: {
            date,
          },
        })
      )
      tasks.Items.sort((a, b) =>
        a.snooze && new Date(a.snooze) >= new Date()
          ? 1
          : b.snooze && new Date(b.snooze) >= new Date()
          ? -1
          : 0
      )
      return tasks
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
}
