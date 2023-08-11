import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { dateString } from '../helpers/dates'

// types
import { SubTask, Task, taskSchema } from '../types/task'

export const tasksSchema = z.object({
  Items: z.array(taskSchema),
  Count: z.number(),
  ScannedCount: z.number(),
})

const subtaskIsSnoozed = (s: SubTask) =>
  s.snooze && new Date(s.snooze) >= new Date()

export const isSnoozed = (t: Task) =>
  (t.snooze && new Date(t.snooze) >= new Date()) ||
  (t.subtasks &&
    t.subtasks.length > 0 &&
    !t.subtasks.some(s => !s.done && !subtaskIsSnoozed(s)))

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
      tasks.Items.sort((a, b) => (isSnoozed(a) ? 1 : isSnoozed(b) ? -1 : 0))
      return tasks
    },
    {
      refetchInterval: 1000 * 2,
      refetchIntervalInBackground: false,
    }
  )
}
