/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

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

  if (!('title' in body)) return error('Missing title!')

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
    Key: { title: body.title },
  }

  const task = (await docClient.get(params).promise())?.Item

  if (!task) return error('No task corresponding to title')

  let response

  const allSubtasks = 'allSubtasks' in body ? body.allSubtasks : false

  if (
    !allSubtasks &&
    'subtasks' in task &&
    ('subtask' in body ||
      task.subtasks.some(
        st =>
          !st.done && (!('snooze' in st) || new Date(st.snooze) <= new Date())
      ))
  ) {
    // has an unsnoozed subtask
    const subtaskTitle = 'subtask' in body ? body.subtask : undefined
    const i = subtaskTitle
      ? task.subtasks.findIndex(st => st.title === subtaskTitle)
      : // if we haven't passed a subtask explicitly, find first unsnoozed subtask
        task.subtasks.findIndex(
          st =>
            !st.done && (!('snooze' in st) || new Date(st.snooze) <= new Date())
        )
    const newSubtasks = [
      ...task.subtasks.slice(0, i),
      {
        ...task.subtasks[i],
        snooze: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      },
      ...task.subtasks.slice(i + 1),
    ]

    let updateParams = {
      TableName: ENV.STORAGE_TASKS_NAME,
      Key: {
        title: task.title,
      },
      UpdateExpression: 'set #subtasks = :newsubtasks',
      ExpressionAttributeNames: { '#subtasks': 'subtasks' },
      ExpressionAttributeValues: {
        ':newsubtasks': newSubtasks,
      },
    }

    response = await docClient.update(updateParams).promise()
  } else {
    var updateParams = {
      TableName: ENV.STORAGE_TASKS_NAME,
      Key: {
        title: body.title,
      },
      UpdateExpression: 'set #snooze = :snooze',
      ExpressionAttributeNames: { '#snooze': 'snooze' },
      ExpressionAttributeValues: {
        ':snooze': new Date(
          new Date().getTime() + 60 * 60 * 1000
        ).toISOString(),
      },
    }

    response = await docClient.update(updateParams).promise()
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
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
