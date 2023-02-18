/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HISTORY_ARN
	STORAGE_HISTORY_NAME
	STORAGE_HISTORY_STREAMARN
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

  console.log(`TODAY: ${today}`)

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: dateString(today),
    },
  }

  let data = await docClient.get(historyGetParams).promise()

  const done = data?.Item?.tasks?.reduce((acc,cur) => acc + (cur?.timeFrame ?? 30), 0) ?? 0
  const doneBeforeToday = data?.Item?.doneBeforeToday ?? 0
  const todo = getTodo(today)

  console.log(`DONE: ${done}`)
  console.log(`DONE BEFORE TODAY: ${doneBeforeToday}`)
  console.log(`TODO: ${todo}`)

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
    }),
  }

  console.log(`RETURN: ${JSON.stringify(res)}`)

  return res
}

const getTodo = date => 8 * 60 // {
//    switch (date.getDay()) {
//        case 0:
//            return 4
//        case 6:
//            return 5
//        default:
//            return 10
//    }
//}

const dateString = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

