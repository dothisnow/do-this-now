import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export const useQueryUpdateTask = (): { mutate: (task: any) => void } => {
  const navigate = useNavigate()
  return useMutation(
    async task => {
      return API.post('tasks', '/tasks/update', { body: task }).catch(
        console.error
      )
    },
    { onSuccess: () => navigate(-1) }
  )
}
