import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'

import { useQueryTasks } from './hooks/useQueryTasks'
import useKeyAction from './hooks/useKeyAction'

const Tasks = () => {
    const [selectedTask, setSelectedTask] = useState(0)

    const navigate = useNavigate()

    const { data, isFetching } = useQueryTasks()

    const tasks = (data?.Items ?? []).map((task) => ({
        due: 'No Due Date',
        ...task,
    }))

    const keyActions = [
        [
            'ArrowUp',
            'Select previous task',
            () => setSelectedTask(Math.max(selectedTask - 1, 0)),
        ],
        [
            'ArrowDown',
            'Select next task',
            () => setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1)),
        ],
        ['Escape', 'Home', () => navigate('/')],
        ['n', 'New task', () => navigate('/new-task')],
    ]
    useKeyAction(keyActions)

    const formatDate = (date) =>
        format(
            new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
                0,
                0,
                0
            ),
            'EEEE, LLLL do, u'
        )

    tasks.sort((a, b) =>
        a.due === 'No Due Date'
            ? -1
            : b.due === 'No Due Date'
            ? 1
            : new Date(a.due) - new Date(b.due)
    )

    return (
        <RequireAuth>
            <div className='h-screen my-10'>
                {tasks.map((task, i) => (
                    <Fragment key={task.title}>
                        {(i === 0 ||
                            formatDate(new Date(tasks[i - 1].due)) !==
                                formatDate(new Date(task.due))) && (
                            <div
                                className={
                                    (new Date(task.due) <
                                    new Date().setDate(new Date().getDate() - 1)
                                        ? 'text-orange-300'
                                        : 'text-white') +
                                    ' w-96 mx-auto text-center text-sm'
                                }>
                                {formatDate(new Date(task.due))}
                            </div>
                        )}
                        <Task isSelected={i === selectedTask} {...task} />
                    </Fragment>
                ))}
                {isFetching && <Loading />}
            </div>
            <Hints keyActions={keyActions} />
        </RequireAuth>
    )
}

const Task = ({ isSelected, timeFrame, title }) => (
    <div
        className={
            (isSelected
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-800 border-gray-700') +
            ' block w-96 mx-auto border p-4 my-1 rounded drop-shadow-sm font-bold text-md text-center text-white'
        }>
        <span>{title}</span>
        <TimeFrame timeFrame={timeFrame} />
    </div>
)

const TimeFrame = ({ timeFrame }) => {
    if (!timeFrame) return <></>
    const text =
        timeFrame < 60
            ? `${timeFrame} mins`
            : timeFrame / 60 === 1
            ? '1 hr'
            : `${timeFrame / 60} hrs`
    return (
        <span className='text-white inline-block text-xs bg-white bg-opacity-20 rounded p-1 px-1.5 ml-2'>
            {text}
        </span>
    )
}

export default Tasks
