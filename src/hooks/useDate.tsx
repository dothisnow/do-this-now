import { useEffect, useState } from 'react'

export const useDate = () => {
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return date
}
