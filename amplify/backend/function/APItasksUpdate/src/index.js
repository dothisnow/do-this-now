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

  const getParams = {
    TableName: ENV.STORAGE_TASKS_NAME,
    Key: {
      title: 'oldTitle' in body ? body.oldTitle : body.title,
    },
  }

  const { Item: oldItem } = await docClient.get(getParams).promise()

  if (oldItem && 'oldTitle' in body)
    await docClient.delete(getParams).promise()

  console.log(`OLD ITEM: ${JSON.stringify(oldItem)}`)

  const newItem = { ...oldItem, ...body }

  console.log(`NEW ITEM: ${JSON.stringify(oldItem)}`)

  const putParams = {
    TableName: ENV.STORAGE_TASKS_NAME,
    Item: newItem,
  }

  console.log({ putParams })

  const response = await docClient.put(putParams).promise()

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
