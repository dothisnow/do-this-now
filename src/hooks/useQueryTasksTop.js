import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTasksTop = () =>
    useQuery(
        ['tasks-top'],
        () => {
            return API.get('tasks', '/tasks/top', {})
        },
        {
            refetchInterval: 1000 * 2,
            refetchIntervalInBackground: false,
        }
    )
