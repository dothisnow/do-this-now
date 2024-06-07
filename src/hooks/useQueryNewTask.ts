import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { handlePost } from './api'

// types
import { Task } from '../types/task'

export const useQueryNewTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      return z
        .literal('Success')
        .parse(await handlePost({ path: '/tasks/new', body: task }))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
