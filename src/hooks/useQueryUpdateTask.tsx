import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQueryUpdateTask = (): { mutate: (task: any) => void } => {
  return useMutation(
    async (task: Task) => {
      return z
        .object({})
        .parse(await API.post('tasks', '/tasks/update', { body: task }))
    },
    { onSuccess: () => window.history.back() }
  )
}
