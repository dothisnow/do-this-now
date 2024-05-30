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

// eslint-disable-next-line
const { dateString, nextDueDate } = require('/opt/nodejs/helpers')
// eslint-disable-next-line
const ENV = require('process').env
// eslint-disable-next-line
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const today =
    'queryStringParameters' in event && 'date' in event.queryStringParameters
      ? new Date(event.queryStringParameters.date)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        )

  const in2Weeks = new Date(today)
  in2Weeks.setDate(in2Weeks.getDate() + 14)

  console.log(`TODAY: ${today}`)
  console.log(`IN 2 WEEKS: ${in2Weeks}`)

  console.log(`DATESTRING TODAY: ${dateString(today)}`)

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(today),
    },
  }

  let data = await docClient.get(historyGetParams).promise()

  console.log(data.Item?.tasks)

  let done = 0
  for (const t of data?.Item?.tasks ?? [])
    done +=
      'timeFrame' in t
        ? typeof t.timeFrame === 'string'
          ? parseInt(t.timeFrame)
          : t.timeFrame
        : 0

  console.log(done)

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }
  const allTasks = (await docClient.scan(params).promise()).Items

  let totalTimeInNext2Weeks = 0

  // let tasksToDoInNextWeek = []
  for (const task of allTasks) {
    const time = parseInt(task.timeFrame)
    let due = new Date(task.due)
    while (due !== undefined && due <= in2Weeks) {
      totalTimeInNext2Weeks += time
      // tasksToDoInNextWeek.push({ title: task.title, due: dateString(due) })
      if (task.repeat === 'No Repeat') break
      due = nextDueDate({
        ...task,
        due: dateString(due),
      })
    }
  }
  const todo = Math.ceil((totalTimeInNext2Weeks + done) / 14)

  console.log(`DONE: ${done}`)
  console.log(`TODO: ${todo}`)
  // console.log(`TASKS: ${JSON.stringify(tasksToDoInNextWeek)}`)

  const streakBeforeToday = data?.Item?.streakBeforeToday ?? 0
  const lives = data?.Item?.lives ?? 0
  let streak = streakBeforeToday
  let streakIsActive = false

  if (done + lives >= todo) {
    // done with today's tasks
    streak++
    streakIsActive = true

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tomorrowHistoryUpdateParams = {
      TableName: ENV.STORAGE_HISTORY_NAME,
      Key: {
        date: dateString(tomorrow),
      },
      UpdateExpression: 'set #x = :y, #x2 = :y2',
      ExpressionAttributeNames: { '#x': 'streakBeforeToday', '#x2': 'lives' },
      ExpressionAttributeValues: {
        ':y': streak,
        ':y2': done + lives - todo,
      },
    }

    console.log(await docClient.update(tomorrowHistoryUpdateParams).promise())
  }

  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      done,
      lives,
      todo,
      streak,
      streakIsActive,
    }),
  }

  console.log(`RETURN: ${JSON.stringify(res)}`)

  return res
}
