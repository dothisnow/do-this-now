import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Task } from '../types/task'

export const useQueryNewTask = () => {
  const navigate = useNavigate()
  return useMutation(
    async (task: Task) => {
      return API.post('tasks', '/tasks/new', { body: task }).catch(
        console.error
      )
    },
    { onSuccess: () => navigate('/tasks') }
  )
}
