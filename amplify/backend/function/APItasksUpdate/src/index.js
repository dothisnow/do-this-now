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
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`)

    const body = JSON.parse(event.body)

    console.log(`BODY: ${JSON.stringify(body)}`)

    if (!body.hasOwnProperty('title')) return error('Missing title!')

    let newItem
    if (body.hasOwnProperty('oldTitle')) {
        const getParams = {
            TableName: ENV.STORAGE_TASKS_NAME,
            Key: {
                title: body.oldTitle,
            },
        }

        const oldItem = await docClient.delete(getParams).promise()
        if (oldItem) await docClient.delete(getParams).promise()

        const newItem = { ...oldItem, ...body }
    } else {
        const newItem = body
    }

    const putParams = {
        TableName: ENV.STORAGE_TASKS_NAME,
        Item: newItem,
    }

    const response = await docClient.delete(putParams).promise()

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

const error = (m) => ({
    statusCode: 502,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Missing title!'),
})
