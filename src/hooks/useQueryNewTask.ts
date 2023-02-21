import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'

import { Task } from '../types/task'

export const useQueryNewTask = () => {
  return useMutation(
    async (task: Task) => {
      return API.post('tasks', '/tasks/new', { body: task }).catch(
        console.error
      )
    }
    // { onSuccess: () => navigate('/tasks') }
  )
}
