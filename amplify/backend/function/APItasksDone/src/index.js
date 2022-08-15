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

    const params = {
        TableName: ENV.STORAGE_TASKS_NAME,
        Key: {
            title: body.title,
        },
    }

    const data = await docClient.get(params).promise()

    console.log(`DATA: ${JSON.stringify(data)}`)

    let newItem = data.Item

    let response
    if (newItem.repeat === 'No Repeat')
        response = await docClient.delete(params).promise()
    else {
        let date = new Date(newItem.due)
        if (newItem.repeat === 'Daily')
            date.setDate(date.getDate() + newItem.repeatInterval)
        else if (newItem.repeat === 'Weekly')
            date.setDate(date.getDate() + 7 * newItem.repeatInterval)
        else if (newItem.repeat === 'Weekdays') {
            const daysToAdd = date.getDay() === 5 ? 3 : 1
            date.setDate(date.getDate() + daysToAdd * newItem.repeatInterval)
        } else if (newItem.repeat === 'Monthly')
            date.setMonth(date.getMonth() + newItem.repeatInterval)
        else if (newItem.repeat === 'Yearly')
            date.setFullYear(date.getFullYear() + newItem.repeatInterval)
        date.setHours(date.getHours() + 2)
        newItem.due = dateString(date)
        if (!newItem?.history) newItem.history = []
        const now = new Date()
        newItem.history.push(dateString(now))
        const updateParams = {
            TableName: ENV.STORAGE_TASKS_NAME,
            Item: newItem,
        }
        response = await docClient.put(updateParams).promise()
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

const error = (m) => ({
    statusCode: 502,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Missing title!'),
})

const dateString = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
