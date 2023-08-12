/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TASKS_ARN
	STORAGE_TASKS_NAME
	STORAGE_TASKS_STREAMARN
Amplify Params - DO NOT EDIT */

const { dateString, nextDueDate } = require('/opt/nodejs/helpers')

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
  const in2Days = new Date(today)
  in2Days.setDate(in2Days.getDate() + 2)

  console.log(`TODAY: ${today}`)
  console.log(`IN 2 DAYS: ${in2Days}`)

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
    // t =>
    //   !t.hasOwnProperty('history') ||
    //   t.history.filter(d => d === dateString(today)).length === 0,

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
