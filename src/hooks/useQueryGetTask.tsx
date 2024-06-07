import { useQuery } from '@tanstack/react-query'
import { taskSchema } from '../types/task'
import { handleGet } from './api'

export const useQueryGetTask = (title: string) =>
  useQuery(['tasks', 'get', title], async () =>
    taskSchema.parse(
      await handleGet({
        path: '/tasks/get',
        queryParams: { title },
      })
    )
  )
