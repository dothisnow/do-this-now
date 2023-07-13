import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { Task } from '../types/task'

export const useQueryNewTask = () => {
  return useMutation(
    async (task: Task) => {
      return z
        .literal('Success')
        .parse(await API.post('tasks', '/tasks/new', { body: task }))
    },
    { onSuccess: () => window.history.back() }
  )
}
