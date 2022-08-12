import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTaskDone = () => {
    return useMutation(
        (task) => {
            return API.post('tasks', '/tasks/done', { body: task })
        }
        // { onSuccess: () => navigate('/tasks') }
    )
}
