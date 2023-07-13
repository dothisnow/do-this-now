import API from '@aws-amplify/api'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

export const useQueryTaskDelete = () => {
  return useMutation(async task => {
    return z
      .object({})
      .parse(await API.post('tasks', '/tasks/delete', { body: task }))
  })
}
