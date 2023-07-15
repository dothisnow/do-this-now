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

  const body = JSON.parse(event.body)

  console.log(`BODY: ${JSON.stringify(body)}`)

  if (!body.hasOwnProperty('title')) return error('Missing title!')

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
    Key: { title: body.title },
  }

  const task = (await docClient.get(params).promise())?.Item

  if (!task) return error('No task corresponding to title')

  let response

  const allSubtasks = body.hasOwnProperty('allSubtasks')
    ? body.allSubtasks
    : false

  if (
    !allSubtasks &&
    task.hasOwnProperty('subtasks') &&
    task.subtasks.some(
      st =>
        !st.done &&
        (!st.hasOwnProperty('snooze') || new Date(st.snooze) <= new Date())
    )
  ) {
    // has an unsnoozed subtask

    const i = task.subtasks.findIndex(
      st =>
        !st.done &&
        (!st.hasOwnProperty('snooze') || new Date(st.snooze) <= new Date())
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

const error = m => ({
  statusCode: 502,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  body: JSON.stringify('Missing title!'),
})
