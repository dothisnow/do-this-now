import API from '@aws-amplify/api'
import { useQuery } from '@tanstack/react-query'

import { taskSchema } from '../types/task'

export const useQueryGetTask = (title: string) =>
  useQuery(
    ['get-task', title],
    async () => {
      return taskSchema.parse(
        await API.get('tasks', '/tasks/get', {
          queryStringParameters: { title },
        })
      )
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )
