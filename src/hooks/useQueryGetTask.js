import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryGetTask = (title) =>
    useQuery(
        ['get-task', title],
        () => {
            return API.get('tasks', '/tasks/get', {
                queryStringParameters: { title },
            })
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    )
