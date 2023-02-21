import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'

export const useQueryUpdateTask = (): { mutate: (task: any) => void } => {
  return useMutation(
    async task => {
      return API.post('tasks', '/tasks/update', { body: task }).catch(
        console.error
      )
    },
    { onSuccess: () => window.history.back() }
  )
}
