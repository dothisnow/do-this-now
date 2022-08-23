import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { HomeIcon, PlusCircleIcon } from '@heroicons/react/solid'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import { Repeat, Strict, TimeFrame } from './components/tags'

import { useQueryTasks } from './hooks/useQueryTasks'
import useKeyAction from './hooks/useKeyAction'

const Tasks = () => {
    // const [selectedTask, setSelectedTask] = useState(0)

    const navigate = useNavigate()

    const { data, isFetching } = useQueryTasks()

    const tasks = (data?.Items ?? []).map((task) => ({
        due: 'No Due Date',
        ...task,
    }))

    const keyActions = [
        // [
        //     'ArrowUp',
        //     'Select previous task',
        //     () => setSelectedTask(Math.max(selectedTask - 1, 0)),
        // ],
        // [
        //     'ArrowDown',
        //     'Select next task',
        //     () => setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1)),
        // ],
        ['Escape', 'Home', () => navigate('/')],
        ['n', 'New task', () => navigate('/new-task')],
    ]
    useKeyAction(keyActions)

    const formatDate = (date) => {
        try {
            return format(
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
        } catch (e) {
            console.error(e)
            return date.toDateString()
        }
    }

    tasks.sort((a, b) =>
        a.due === 'No Due Date'
            ? -1
            : b.due === 'No Due Date'
            ? 1
            : new Date(a.due) - new Date(b.due)
    )

    return (
        <RequireAuth>
            <div className='h-screen my-10 mx-5'>
                <div className='pb-2 flex flex-row justify-center'>
                    <button
                        onClick={() => navigate('/')}
                        className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                        <span>Home</span>
                        <HomeIcon className='h-5 w-5 ml-1 inline-block' />
                    </button>
                    <button
                        onClick={() => navigate('/new-task')}
                        className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                        <span>New task</span>
                        <PlusCircleIcon className='h-5 w-5 ml-1 inline-block' />
                    </button>
                </div>
                {tasks.map((task, i) => (
                    <Fragment key={task.title}>
                        {(i === 0 ||
                            formatDate(new Date(tasks[i - 1].due)) !==
                                formatDate(new Date(task.due))) && (
                            <div
                                className={
                                    (new Date(task.due) <
                                    new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        new Date().getDate(),
                                        0,
                                        0,
                                        0
                                    )
                                        ? 'text-orange-300'
                                        : 'text-white') +
                                    ' w-96 mx-auto text-center text-sm'
                                }>
                                {new Date(task.due).toDateString()}
                            </div>
                        )}
                        <Task
                            // isSelected={i === selectedTask}
                            {...task}
                        />
                    </Fragment>
                ))}
                {isFetching && <Loading />}
            </div>
            <Hints keyActions={keyActions} />
        </RequireAuth>
    )
}

const Task = ({
    due,
    isSelected,
    repeat,
    repeatInterval,
    repeatUnit,
    strictDeadline,
    timeFrame,
    title,
}) => (
    <div
        className={
            (isSelected
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-800 border-gray-700') +
            ' block md:max-w-sm max-w-96 mx-auto border p-4 my-1 rounded drop-shadow-sm font-bold text-md text-center text-white'
        }>
        <span>{title}</span>
        <TimeFrame timeFrame={timeFrame} />
        <Repeat {...{ repeat, repeatInterval, repeatUnit }} />
        <Strict strictDeadline={strictDeadline} dueDate={due} />
    </div>
)

export default Tasks
