import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { handlePost } from './api'

// types
import { Task } from '../types/task'

export const useQueryUpdateTask = (): { mutate: (task: Task) => void } => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      return z
        .object({})
        .parse(await handlePost({ path: '/tasks/update', body: task }))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
