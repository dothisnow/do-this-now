export const minutesToHours = (minutes: number) => {
  const twoDigitNumberString = (n: number) => (n < 10 ? '0' : '') + n
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes % 60
  return `${hours}h${minutesLeft > 0 ? twoDigitNumberString(minutesLeft) : ''}`
}
