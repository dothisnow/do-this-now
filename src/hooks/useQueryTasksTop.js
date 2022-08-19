import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTasksTop = () =>
    useQuery(
        ['tasks-top'],
        () => {
            return API.get('tasks', '/tasks/top', {
                queryStringParameters: {
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`,
                },
            })
        },
        {
            refetchInterval: 1000 * 2,
            refetchIntervalInBackground: false,
        }
    )
