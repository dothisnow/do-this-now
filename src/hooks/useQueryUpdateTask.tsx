import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import API from '@aws-amplify/api'

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
