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

    const params = {
        TableName: ENV.STORAGE_TASKS_NAME,
    }

    const data = await docClient.scan(params).promise()

    // DO A BUNCH OF SORTING
    let tasks = data.Items
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

const sortFlags = [
    (t) =>
        t.hasOwnProperty('due') &&
        t.hasOwnProperty('strictDeadline') &&
        new Date(t.due) < new Date() &&
        t.strictDeadline,
    (t) =>
        !t.hasOwnProperty('history') ||
        t.history.filter((d) => d === dateString(new Date())).length === 0,
]

const sortProperties = [
    ['due', (x) => new Date(x)],
    ['timeFrame', (x) => x],
]

const dateString = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
