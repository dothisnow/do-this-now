/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_HISTORY_ARN
	STORAGE_HISTORY_NAME
	STORAGE_HISTORY_STREAMARN
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

    if (!body.hasOwnProperty('task') || !body.task.hasOwnProperty('title'))
        return error('Missing title!')
    const task = body.task

    const params = {
        TableName: ENV.STORAGE_TASKS_NAME,
        Key: {
            title: task.title,
        },
    }

    const data = await docClient.get(params).promise()

    console.log(`DATA: ${JSON.stringify(data)}`)

    let newItem = data.Item

    if (
        newItem.hasOwnProperty('subtasks') &&
        newItem.subtasks.filter((st) => st.done === false).length > 0
    ) {
        for (let i = 0; i < newItem.subtasks.length; i++) {
            if (newItem.subtasks[i].done) continue
            newItem.subtasks[i].done = true
            break
        }
        const updateParams = {
            TableName: ENV.STORAGE_TASKS_NAME,
            Item: newItem,
        }
        let subresponse = await docClient.put(updateParams).promise()

        if (newItem.subtasks.filter((st) => st.done === false).length > 0) {
            return {
                statusCode: 200,
                //  Uncomment below to enable CORS requests
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify(subresponse),
            }
        }
    }

    const now = body.hasOwnProperty('date') ? new Date(body.date) : new Date()

    let response
    if (newItem.repeat === 'No Repeat')
        response = await docClient.delete(params).promise()
    else {
        let date = new Date(newItem.due)
        if (
            newItem.repeat === 'Daily' ||
            (newItem.repeat === 'Custom' && newItem.repeatUnit === 'day')
        )
            date.setDate(date.getDate() + newItem.repeatInterval)
        else if (newItem.repeat === 'Weekly')
            date.setDate(date.getDate() + 7 * newItem.repeatInterval)
        else if (newItem.repeat === 'Custom' && newItem.repeatUnit === 'week') {
            if (
                !newItem.hasOwnProperty('repeatWeekdays') ||
                !newItem.repeatWeekdays.some((x) => x)
            )
                date.setDate(date.getDate() + 7 * newItem.repeatInterval)
            else {
                let i
                for (
                    i = (date.getDay() + 1) % 7;
                    !newItem.repeatWeekdays[i];
                    i = (i + 1) % 7
                ) {}
                if (i > date.getDay())
                    date.setDate(date.getDate() + i - date.getDay())
                else {
                    date.setDate(date.getDate() + 7 * newItem.repeatInterval)
                    date.setDate(date.getDate() + i - date.getDay())
                }
            }
        } else if (newItem.repeat === 'Weekdays') {
            const daysToAdd = date.getDay() === 5 ? 3 : 1
            date.setDate(date.getDate() + daysToAdd * newItem.repeatInterval)
        } else if (
            newItem.repeat === 'Monthly' ||
            (newItem.repeat === 'Custom' && newItem.repeatUnit === 'month')
        )
            date.setMonth(date.getMonth() + newItem.repeatInterval)
        else if (
            newItem.repeat === 'Yearly' ||
            (newItem.repeat === 'Custom' && newItem.repeatUnit === 'year')
        )
            date.setFullYear(date.getFullYear() + newItem.repeatInterval)
        date.setHours(date.getHours() + 2)
        newItem.due = dateString(date)
        if (!newItem?.history) newItem.history = []
        newItem.history.push(dateString(now))

        if (
            newItem.hasOwnProperty('subtasks') &&
            Array.isArray(newItem.subtasks) &&
            newItem.subtasks.length > 0
        )
            newItem.subtasks = newItem.subtasks.map((x) => ({
                ...x,
                done: false,
            }))

        const updateParams = {
            TableName: ENV.STORAGE_TASKS_NAME,
            Item: newItem,
        }
        response = await docClient.put(updateParams).promise()
    }

    const historyGetParams = {
        TableName: ENV.STORAGE_HISTORY_NAME,
        Key: {
            date: dateString(now),
        },
    }

    let historyPutParams = {
        TableName: ENV.STORAGE_HISTORY_NAME,
    }
    await docClient
        .get(historyGetParams)
        .promise()
        .then((oldHistory) => {
            historyPutParams.Item = oldHistory.Item
            if (historyPutParams.Item?.tasks) {
                historyPutParams.Item.tasks = [
                    ...historyPutParams.Item?.tasks,
                    task.title,
                ]
            } else {
                historyPutParams.Item.tasks = [task.title]
            }
        })
        .catch(() => {
            historyPutParams.Item = {
                date: dateString(now),
                tasks: [task.title],
            }
        })

    await docClient.put(historyPutParams).promise()

    const doneToday =
        (historyPutParams.Item?.doneBeforeToday ?? 0) +
        historyPutParams.Item.tasks.length
    const doneBeforeTomorrow = Math.max(0, doneToday - getTodo(now))

    const historyUpdateParams = {
        TableName: ENV.STORAGE_HISTORY_NAME,
        Key: {
            date: dateString(
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + 1,
                    0,
                    0,
                    0
                )
            ),
        },
        UpdateExpression: 'set #x = :y',
        ExpressionAttributeNames: { '#x': 'doneBeforeToday' },
        ExpressionAttributeValues: {
            ':y': doneBeforeTomorrow,
        },
    }

    console.log(await docClient.update(historyUpdateParams).promise())

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

const dateString = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

const getTodo = (date) => {
    switch (date.getDay()) {
        case 0:
        case 6:
            return 5
        default:
            return 10
    }
}
