import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

// types
import { Task } from '../types/task'

export const useQueryTaskDone = () => {
  return useMutation(async (task: Task) => {
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
  })
}
