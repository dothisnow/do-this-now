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

  const body = JSON.parse(event.body)

  console.log(`BODY: ${JSON.stringify(body)}`)

  if (!('task' in body) || !('title' in body.task))
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
    'subtasks' in newItem &&
    ('subtask' in body || newItem.subtasks.some(st => !st.done))
  ) {
    const subtaskTitle = 'subtask' in body ? body.subtask : undefined
    const nextSubtask = subtaskTitle
      ? newItem.subtasks.find(st => st.title === subtaskTitle)
      : newItem.subtasks.find(
          s => !s.done && (!s.snooze || new Date(s.snooze) < new Date())
        ) ?? newItem.subtasks.find(s => !s.done)
    nextSubtask.done = true
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

  const now = 'date' in body ? new Date(body.date) : new Date()

  const newDue = nextDueDate(newItem)

  let response
  if (newItem.repeat === 'No Repeat' || newDue === undefined)
    response = await docClient.delete(params).promise()
  else {
    newItem.due = dateString(newDue)

    if (!newItem?.history) newItem.history = []
    newItem.history.push(dateString(now))

    if (
      'subtasks' in newItem &&
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
        historyPutParams.Item.tasks = [...historyPutParams.Item.tasks, task]
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
