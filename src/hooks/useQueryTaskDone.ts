import API from '@aws-amplify/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQueryTaskDone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      return z.object({}).parse(
        await API.post('tasks', '/tasks/done', {
          body: {
            task,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}`,
          },
        })
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
