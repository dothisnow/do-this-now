import { useQuery } from 'react'
import * as fs from 'fs'

export const getTasks = useQuery(['get-tasks'], {
    return fs.readFile('../data/tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return []
        } 
        return data
    })
})