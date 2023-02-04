import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'

export const useQueryTaskDelete = () => {
  return useMutation(
    task => {
      return API.post('tasks', '/tasks/delete', { body: task }).catch(
        console.error
      )
    }
    // { onSuccess: () => navigate('/tasks') }
  )
}
