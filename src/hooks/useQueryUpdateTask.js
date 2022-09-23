import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryUpdateTask = () => {
    const navigate = useNavigate()
    return useMutation(
        (task) => {
            return API.post('tasks', '/tasks/update', { body: task })
        },
        { onSuccess: () => navigate(-1) }
    )
}
