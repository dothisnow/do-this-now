/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HISTORY_ARN
	STORAGE_HISTORY_NAME
	STORAGE_HISTORY_STREAMARN
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
  const nextWeek = new Date().setDate(today.getDate() + 7)

  console.log(`TODAY: ${today}`)

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(today),
    },
  }

  let data = await docClient.get(historyGetParams).promise()

  const done =
    data?.Item?.tasks?.reduce(
      (acc, cur) => acc + (parseInt(cur?.timeFrame) ?? 30),
      0
    ) ?? 0
  const doneBeforeToday = data?.Item?.doneBeforeToday ?? 0

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }
  const allTasks = (await docClient.scan(params).promise()).Items

  let totalTimeInNextWeek = 0
  // let tasksToDoInNextWeek = []
  for (const task of allTasks) {
    const time = parseInt(task.timeFrame)
    let due = new Date(task.due)
    while (due <= nextWeek) {
      totalTimeInNextWeek += time
      // tasksToDoInNextWeek.push({ title: task.title, due: dateString(due) })
      if (task.repeat === 'No Repeat') break
      due = nextDueDate({
        ...task,
        due: dateString(due),
      })
    }
  }
  const todo =
    Math.ceil((totalTimeInNextWeek + done + doneBeforeToday) / 7 / 60) * 60

  console.log(`DONE: ${done}`)
  console.log(`DONE BEFORE TODAY: ${doneBeforeToday}`)
  console.log(`TODO: ${todo}`)

  const historyUpdateParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
          0,
          0,
          0
        )
      ),
    },
    UpdateExpression: 'set #x = :y',
    ExpressionAttributeNames: { '#x': 'doneBeforeToday' },
    ExpressionAttributeValues: {
      ':y': Math.min(done + doneBeforeToday - todo, 0),
    },
  }

  console.log(await docClient.update(historyUpdateParams).promise())

  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      done,
      doneBeforeToday,
      todo,
      allTasks,
      totalTimeInNextWeek,
    }),
  }

  console.log(`RETURN: ${JSON.stringify(res)}`)

  return res
}

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
