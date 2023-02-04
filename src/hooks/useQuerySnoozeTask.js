import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'

export const useQuerySnoozeTask = () => {
  return useMutation(
    ({ title }) => {
      return API.post('tasks', '/tasks/snooze', {
        body: {
          title,
        },
      }).catch(console.error)
    }
    // { onSuccess: () => navigate('/tasks') }
  )
}
