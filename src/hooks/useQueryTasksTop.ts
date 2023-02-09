import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

import { dateString } from '../helpers/dates'

import { Task } from '../types/task'

export const useQueryTasksTop = () => {
  const date = dateString(new Date())
  return useQuery(
    ['tasks-top', date],
    async () => {
      const tasks = await API.get('tasks', '/tasks/top', {
        queryStringParameters: {
          date,
        },
      }).catch(console.error)
      tasks?.Items?.sort((a: Task, b: Task) =>
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
