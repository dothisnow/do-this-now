import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

export const useQuerySnoozeTask = () => {
  return useMutation(async ({ title }: { title: string }) => {
    return z.object({}).parse(
      await API.post('tasks', '/tasks/snooze', {
        body: {
          title,
        },
      })
    )
  })
}
