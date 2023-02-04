import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'

export const useQuerySnoozeTask = () => {
  return useMutation(async ({ title }: { title: string }) => {
    return API.post('tasks', '/tasks/snooze', {
      body: {
        title,
      },
    }).catch(console.error)
  })
}
