import { useQuery } from '@tanstack/react-query'
import API from '@aws-amplify/api'

export const useQueryGetTask = (title : string) =>
    useQuery(
        ['get-task', title],
        async () => {
            return API.get('tasks', '/tasks/get', {
                queryStringParameters: { title },
            }).catch(console.error)
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    )
