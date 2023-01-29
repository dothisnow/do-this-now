import { DateString } from '../types/task'

export const newSafeDate = (str: DateString) => {
    const [year, month, day] = str.split('-').map(s => parseInt(s))
    return new Date(year, month - 1, day)
}

export const dateString = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
