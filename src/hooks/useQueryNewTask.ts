import API from '@aws-amplify/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQueryNewTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      return z
        .literal('Success')
        .parse(await API.post('tasks', '/tasks/new', { body: task }))
    },
    onSuccess: () => window.history.back(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-top'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
