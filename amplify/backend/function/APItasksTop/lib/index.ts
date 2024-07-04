/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

import { sortTasks } from './task-sorting'

// eslint-disable-next-line
const ENV = require('process').env
// eslint-disable-next-line
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event: unknown) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const today =
    event &&
    typeof event === 'object' &&
    'queryStringParameters' in event &&
    event.queryStringParameters &&
    typeof event.queryStringParameters === 'object' &&
    'date' in event.queryStringParameters &&
    typeof event.queryStringParameters.date === 'string'
      ? new Date(event.queryStringParameters.date)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        )

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }

  const data = await docClient.scan(params).promise()

  const tasks = data.Items
  sortTasks(tasks, today)

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
