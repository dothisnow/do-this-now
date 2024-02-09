import { useEffect, useState } from 'react'

export const useNow = () => {
  const [now, setNow] = useState(new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return now
}
