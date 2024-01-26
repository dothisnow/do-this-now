/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HISTORY_ARN
	STORAGE_HISTORY_NAME
	STORAGE_HISTORY_STREAMARN
Amplify Params - DO NOT EDIT */

// eslint-disable-next-line
const { dateString } = require('/opt/nodejs/helpers')
// eslint-disable-next-line
const ENV = require('process').env
// eslint-disable-next-line
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({ region: ENV.REGION })

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const today =
                'pathParameters' in event &&
                'date' in event.pathParameters
      ? new Date(event.pathParameters.date)
      : new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        )

  const historyGetParams = {
    TableName: ENV.STORAGE_HISTORY_NAME,
    Key: {
      date: { S: dateString(today) },
    },
  }

  let data = await client.send(new GetItemCommand(historyGetParams))

  console.log(`DATA: ${JSON.stringify(data)}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(data?.Item),
  }
}
