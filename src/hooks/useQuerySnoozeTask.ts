import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQuerySnoozeTask = () => {
  return useMutation(
    async ({
      task: { title },
      allSubtasks = false,
    }: {
      task: Task
      allSubtasks?: boolean
    }) => {
      return z.object({}).parse(
        await API.post('tasks', '/tasks/snooze', {
          body: {
            title,
            allSubtasks,
          },
        })
      )
    }
  )
}
