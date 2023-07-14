/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

const ENV = require('process').env

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const today =
    event.hasOwnProperty('queryStringParameters') &&
    event.queryStringParameters.hasOwnProperty('date')
      ? new Date(event.queryStringParameters.date)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        )
  const in2Days = new Date().setDate(today.getDate() + 2)

  const sortFlags = [
    // due today or past due
    t => t.hasOwnProperty('due') && new Date(t.due) <= today,

    // strict deadline and due today or past due
    t =>
      t.hasOwnProperty('due') &&
      t.hasOwnProperty('strictDeadline') &&
      new Date(t.due) <= today &&
      t.strictDeadline,

    // has not been done today
    t =>
      !t.hasOwnProperty('history') ||
      t.history.filter(d => d === dateString(today)).length === 0,

    // if I do this today, I won't have to do it tomorrow
    t =>
      t.hasOwnProperty('due') &&
      new Date(t.due) <= today &&
      nextDueDate(t) >= in2Days,
  ]

  const sortProperties = [
    ['due', x => new Date(x)],
    ['timeFrame', x => (x === 0 ? Infinity : x)],
  ]

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }

  const data = await docClient.scan(params).promise()

  // DO A BUNCH OF SORTING
  let tasks = data.Items

  // flag logs
  // for (const t of tasks)
  //   for (let i = 0; i < sortFlags.length; i++)
  //     console.log(`${t.title} flag ${i}: ${sortFlags[i](t)}`)

  tasks.sort((a, b) => {
    for (const flag of sortFlags) {
      if (flag(a) && !flag(b)) return -1
      if (flag(b) && !flag(a)) return 1
    }
    for (const [p, transform] of sortProperties) {
      if (!a.hasOwnProperty(p) || !b.hasOwnProperty(p)) continue
      if (transform(a[p]) - transform(b[p]) !== 0)
        return transform(a[p]) - transform(b[p])
    }
    return 0
  })

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(data),
  }
}

const dateString = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

const nextDueDate = task => {
  let date = new Date(task.due)
  if (task.repeat === 'Daily') date.setDate(date.getDate() + 1)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'day')
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
  else date.setFullYear(new Date().getFullYear() + 1)
  date.setHours(date.getHours() + 2)
  return new Date(dateString(date))
}
