/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

import { nextDueDate } from './helpers'
import { Task } from './task'

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
  const in2Days = new Date(today)
  in2Days.setDate(in2Days.getDate() + 2)

  console.log(`TODAY: ${today}`)
  console.log(`IN 2 DAYS: ${in2Days}`)

  const sortFlags = [
    // due today or past due
    (t: Task) => 'due' in t && new Date(t.due) <= today,

    // strict deadline and due today or past due
    (t: Task) =>
      'due' in t &&
      'strictDeadline' in t &&
      new Date(t.due) <= today &&
      t.strictDeadline,

    // has not been done today
    // t =>
    //   !t.hasOwnProperty('history') ||
    //   t.history.filter(d => d === dateString(today)).length === 0,

    // if I do this today, I won't have to do it tomorrow
    (t: Task) =>
      'due' in t &&
      new Date(t.due) <= today &&
      (nextDueDate(t) ?? Infinity) >= in2Days,
  ]

  const params = {
    TableName: ENV.STORAGE_TASKS_NAME,
  }

  const data = await docClient.scan(params).promise()

  // DO A BUNCH OF SORTING
  const tasks = data.Items

  // flag logs
  // for (const t of tasks)
  //   for (let i = 0; i < sortFlags.length; i++)
  //     console.log(`${t.title} flag ${i}: ${sortFlags[i](t)}`)

  tasks.sort((a: Task, b: Task) => {
    for (const flag of sortFlags) {
      if (flag(a) && !flag(b)) return -1
      if (flag(b) && !flag(a)) return 1
    }
    if ('due' in a && 'due' in b && a.due !== b.due)
      return new Date(a.due).getTime() - new Date(b.due).getTime()
    if ('timeFrame' in a && 'timeFrame' in b && a.timeFrame !== b.timeFrame) {
      if (a.timeFrame === 0) return 1
      if (b.timeFrame === 0) return -1
      return a.timeFrame - b.timeFrame
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
