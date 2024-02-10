import API from '@aws-amplify/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQueryTaskDelete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      return z
        .object({})
        .parse(await API.post('tasks', '/tasks/delete', { body: task }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-top'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
