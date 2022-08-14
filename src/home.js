import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { CheckCircleIcon } from '@heroicons/react/solid'

import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TimeFrame from './components/timeframe'

const Home = () => {
    const [mainTask, setMainTask] = useState(0) // 0 - Math.min(2, tasks.length-1)
    const navigate = useNavigate()

    const { data, isLoading, refetch } = useQueryTasksTop()
    console.log({ isLoading, data })

    const tasks = data?.Items ?? []

    const mainTaskToShow = Math.min(mainTask, tasks.length - 1)
    const leftTask = mainTaskToShow === 0 ? 1 : 0
    const rightTask = mainTaskToShow === 2 ? 1 : 2

    const { mutate } = useQueryTaskDone()

    const keyActions = [
        [
            'd',
            'Task done',
            () => {
                mutate(tasks[mainTaskToShow])
                setMainTask(0)
                refetch()
            },
        ],
        [
            'l',
            'Logout',
            () => window.confirm('You sure?') && loginManager.signOut(),
        ],
        [
            'n',
            'New task',
            (e) => {
                e.preventDefault()
                navigate('/new-task')
            },
        ],
        ['t', 'Tasks', () => navigate('/tasks')],
        ['1', 'Do left task', () => setMainTask(leftTask)],
        ['2', 'Do right task', () => setMainTask(rightTask)],
    ]
    useKeyAction(keyActions)

    return (
        <RequireAuth>
            <div className='h-screen flex flex-col justify-center'>
                {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
                <div className='max-w-xs mx-auto border border-gray-700 py-auto p-6 rounded bg-gray-800 drop-shadow-sm font-bold text-lg text-center text-white'>
                    {isLoading ? (
                        <Loading />
                    ) : tasks.length > 0 ? (
                        <>
                            <div>
                                <span>{tasks[mainTaskToShow].title}</span>
                                <TimeFrame
                                    timeFrame={tasks[mainTaskToShow].timeFrame}
                                />
                            </div>
                            {/* <div className='mt-2'>
                                <button
                                    type='button'
                                    title='(Shortcut: d)'
                                    className='inline-flex items-center p-1 border border-transparent rounded shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                                    <CheckCircleIcon
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                    />
                                </button>
                            </div> */}
                        </>
                    ) : (
                        'No tasks'
                    )}
                </div>
                {tasks.length > 1 && (
                    <>
                        <div className='py-2 text-center text-white'>or</div>
                        <div className='flex flex-row justify-center'>
                            <div
                                onClick={() => setMainTask(leftTask)}
                                title='(Shortcut: 1)'
                                className='border cursor-pointer border-gray-700 py-auto p-4 rounded bg-gray-800 drop-shadow-sm font-bold text-sm text-center mr-4 opacity-70 text-white'>
                                <span>{tasks[leftTask].title}</span>
                                <TimeFrame
                                    timeFrame={tasks[leftTask].timeFrame}
                                />
                            </div>
                            {tasks.length > 2 && (
                                <div
                                    onClick={() => setMainTask(rightTask)}
                                    title='(Shortcut: 2)'
                                    className='border cursor-pointer border-gray-700 py-auto p-4 rounded bg-gray-800 drop-shadow-sm font-bold text-sm text-center opacity-70 text-white'>
                                    <span>{tasks[rightTask].title}</span>
                                    <TimeFrame
                                        timeFrame={tasks[rightTask].timeFrame}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
                <Hints keyActions={keyActions} />
            </div>
        </RequireAuth>
    )
}

export default Home
