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

  const body = JSON.parse(event.body)

  console.log(`BODY: ${JSON.stringify(body)}`)

  if (!body.hasOwnProperty('task') || !body.task.hasOwnProperty('title'))
    return error('Missing title!')
  const task = body.task

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
    Key: {
      title: task.title,
    },
  }

  const data = await docClient.get(params).promise()

  console.log(`DATA: ${JSON.stringify(data)}`)

  let newItem = data.Item

  if (
    newItem.hasOwnProperty('subtasks') &&
    newItem.subtasks.some(st => !st.done)
  ) {
    for (let i = 0; i < newItem.subtasks.length; i++) {
      if (
        newItem.subtasks[i].done ||
        (newItem.subtasks[i].snooze &&
          new Date(newItem.subtasks[i].snooze) >= new Date())
      )
        continue
      newItem.subtasks[i].done = true
      break
    }
    const updateParams = {
      TableName: ENV.STORAGE_TASKS_NAME,
      Item: newItem,
    }
    let subresponse = await docClient.put(updateParams).promise()

    if (newItem.subtasks.filter(st => st.done === false).length > 0) {
      return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify(subresponse),
      }
    }
  }

  const now = body.hasOwnProperty('date') ? new Date(body.date) : new Date()

  let response
  if (newItem.repeat === 'No Repeat')
    response = await docClient.delete(params).promise()
  else {
    newItem.due = dateString(nextDueDate(newItem))

    if (!newItem?.history) newItem.history = []
    newItem.history.push(dateString(now))

    if (
      newItem.hasOwnProperty('subtasks') &&
      Array.isArray(newItem.subtasks) &&
      newItem.subtasks.length > 0
    )
      newItem.subtasks = newItem.subtasks.map(x => ({
        ...x,
        done: false,
      }))

    const updateParams = {
      TableName: ENV.STORAGE_TASKS_NAME,
      Item: newItem,
    }
    response = await docClient.put(updateParams).promise()
  }

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(now),
    },
  }

  let historyPutParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
  }
  await docClient
    .get(historyGetParams)
    .promise()
    .then(oldHistory => {
      historyPutParams.Item = oldHistory.Item
      if (historyPutParams.Item?.tasks) {
        historyPutParams.Item.tasks = [...historyPutParams.Item?.tasks, task]
      } else {
        historyPutParams.Item.tasks = [task]
      }
    })
    .catch(() => {
      historyPutParams.Item = {
        date: dateString(now),
        tasks: [task],
      }
    })

  await docClient.put(historyPutParams).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(response),
  }
}

const error = () => ({
  statusCode: 502,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  body: JSON.stringify('Missing title!'),
})

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
