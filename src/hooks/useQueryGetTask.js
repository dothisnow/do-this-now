import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryGetTask = (title) =>
    useQuery(['get-task'], () => {
        return API.get('tasks', '/tasks/get', { title })
    })
