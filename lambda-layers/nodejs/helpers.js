const dateString = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

const nextDueDate = task => {
  let date = new Date(task.due)
  if (task.repeat === 'Daily') date.setDate(date.getDate() + 1)
  if (task.repeat === 'Custom' && task.repeatUnit === 'day')
    date.setDate(date.getDate() + task.repeatInterval)
  else if (task.repeat === 'Weekly') date.setDate(date.getDate() + 7)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'week') {
    if (
      !task.hasOwnProperty('repeatWeekdays') ||
      !task.repeatWeekdays.some(x => x)
    )
      date.setDate(date.getDate() + 7 * task.repeatInterval)
    else {
      let i
      for (
        i = (date.getDay() + 1) % 7;
        !task.repeatWeekdays[i];
        i = (i + 1) % 7
      ) {}
      if (i > date.getDay()) date.setDate(date.getDate() + i - date.getDay())
      else {
        date.setDate(date.getDate() + 7 * task.repeatInterval)
        date.setDate(date.getDate() + i - date.getDay())
      }
    }
  } else if (task.repeat === 'Weekdays') {
    const daysToAdd = date.getDay() === 5 ? 3 : 1
    date.setDate(date.getDate() + daysToAdd * task.repeatInterval)
  } else if (task.repeat === 'Monthly') date.setMonth(date.getMonth() + 1)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'month')
    date.setMonth(date.getMonth() + task.repeatInterval)
  else if (task.repeat === 'Yearly') date.setFullYear(date.getFullYear() + 1)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'year')
    date.setFullYear(date.getFullYear() + task.repeatInterval)
  date.setHours(date.getHours() + 2)
  return new Date(dateString(date))
}

exports.dateString = dateString
exports.nextDueDate = nextDueDate
