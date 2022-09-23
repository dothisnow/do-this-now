import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryGetTask = (title) =>
    useQuery(
        ['get-task', title],
        () => {
            const data = API.get('tasks', '/tasks/get', {
                queryStringParameters: { title },
            })
            console.log(data)
            return data
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    )
