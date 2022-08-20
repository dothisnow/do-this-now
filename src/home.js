import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSound from 'use-sound'
import {
    CheckCircleIcon,
    MenuIcon,
    PlusCircleIcon,
} from '@heroicons/react/solid'

import { useQueryClient } from 'react-query'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

import ding from './soundeffects/ding.mp3'

const Home = () => {
    const [mainTask, setMainTask] = useState('') // 0 - Math.min(2, tasks.length-1)
    const navigate = useNavigate()
    const [playDing] = useSound(ding, { volume: 1 })

    const queryClient = useQueryClient()

    const { data, isLoading, refetch } = useQueryTasksTop()

    const tasks = data?.Items ?? []

    const tasksDoneToday = tasks.reduce((acc, cur) => {
        if (cur.hasOwnProperty('history')) {
            return (
                acc +
                cur.history.filter(
                    (d) =>
                        d ===
                        `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()}`
                ).length
            )
        }
        return acc
    }, 0)

    const topTask =
        mainTask !== ''
            ? tasks.find(({ title }) => title === mainTask)
            : tasks[0]
    const leftTask = tasks.find(({ title }) => title !== topTask.title)
    const rightTask = tasks.find(
        ({ title }) => title !== topTask.title && title !== leftTask.title
    )

    const { mutate, isLoading: doneIsLoading } = useQueryTaskDone()
    const { mutate: mutateDelete, isLoading: deleteIsLoading } =
        useQueryTaskDelete()

    const completeTask = () => {
        playDing()
        mutate(topTask)
        setMainTask('')
        refetch()
    }

    const keyActions = [
        ['d', 'Task done', completeTask],
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
        ['1', 'Do left task', () => setMainTask(leftTask.title)],
        ['2', 'Do right task', () => setMainTask(rightTask.title)],
        [
            'Backspace',
            'Delete current task',
            () =>
                window.confirm(
                    `Are you sure you want to delete '${topTask.title}'?`
                ) &&
                mutateDelete(topTask) &&
                queryClient.invalidateQueries('tasks-top'),
        ],
    ]
    useKeyAction(keyActions)

    return (
        <RequireAuth>
            <div className='h-screen flex flex-col justify-center'>
                {isLoading || doneIsLoading || deleteIsLoading ? (
                    <Loading />
                ) : (
                    <>
                        {/* <div className='text-center py-1 font-bold text-gray-500 text-sm'>
                            Done Today: {tasksDoneToday}
                        </div> */}
                        <div className='flex flex-row justify-center mb-2'>
                            <div className='w-36 border border-gray-700 bg-gray-800 h-2 rounded-full'>
                                <div
                                    className='bg-white h-full rounded-full'
                                    style={{
                                        width:
                                            Math.min(tasksDoneToday * 10, 100) +
                                            '%',
                                    }}
                                />
                            </div>
                        </div>
                        <div className='md:max-w-sm mx-5 md:mx-auto border border-gray-700 py-auto p-6 rounded bg-gray-800 drop-shadow-sm font-bold text-lg text-center text-white'>
                            {tasks.length > 0 ? (
                                <>
                                    <div>
                                        <span>
                                            {topTask.hasOwnProperty(
                                                'subtasks'
                                            ) && topTask.subtasks.length > 0
                                                ? topTask.subtasks.find(
                                                      (s) => !s.done
                                                  ).title
                                                : topTask.title}
                                        </span>
                                    </div>
                                    {topTask.hasOwnProperty('subtasks') &&
                                        topTask.subtasks.length > 0 && (
                                            <div className='text-xs py-1 font-normal'>
                                                {topTask.title} (
                                                {topTask.subtasks.reduce(
                                                    (acc, cur) =>
                                                        acc +
                                                        (cur.done ? 1 : 0),
                                                    0
                                                )}
                                                /{topTask.subtasks.length})
                                            </div>
                                        )}
                                    <div>
                                        <DateTag due={topTask.due} />
                                        <TimeFrame
                                            timeFrame={topTask.timeFrame}
                                        />
                                        <Repeat
                                            repeat={topTask.repeat}
                                            repeatInterval={
                                                topTask.repeatInterval
                                            }
                                            repeatUnit={topTask.repeatUnit}
                                        />
                                        <Strict
                                            strictDeadline={
                                                topTask.strictDeadline
                                            }
                                            dueDate={topTask.due}
                                        />
                                    </div>
                                </>
                            ) : (
                                'No tasks'
                            )}
                        </div>
                        <div className='pt-2 flex flex-row justify-center mx-5'>
                            <button
                                onClick={completeTask}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600'>
                                <span>Complete</span>
                                <CheckCircleIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                            <button
                                onClick={() => navigate('/tasks')}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                                <span>All tasks</span>
                                <MenuIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                            <button
                                onClick={() => navigate('/new-task')}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                                <span>New task</span>
                                <PlusCircleIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                        </div>
                        {tasks.length > 1 && (
                            <>
                                <div className='py-2 text-center text-gray-600'>
                                    or
                                </div>
                                <div className='flex flex-col md:flex-row justify-center mx-5'>
                                    <div
                                        onClick={() =>
                                            setMainTask(leftTask.title)
                                        }
                                        title='(Shortcut: 1)'
                                        className='border mb-2 cursor-pointer border-gray-700 hover:border-gray-600 py-auto p-4 rounded bg-gray-800 hover:bg-gray-700 drop-shadow-sm font-bold text-sm text-center md:mr-4 md:mb-0 opacity-20 text-white'>
                                        <span>{leftTask.title}</span>
                                        <DateTag due={leftTask.due} />
                                        <TimeFrame
                                            timeFrame={leftTask.timeFrame}
                                        />
                                        <Repeat
                                            repeat={leftTask.repeat}
                                            repeatInterval={
                                                leftTask.repeatInterval
                                            }
                                            repeatUnit={leftTask.repeatUnit}
                                        />
                                        <Strict
                                            strictDeadline={
                                                leftTask.strictDeadline
                                            }
                                            dueDate={leftTask.due}
                                        />
                                    </div>
                                    {tasks.length > 2 && (
                                        <div
                                            onClick={() =>
                                                setMainTask(rightTask.title)
                                            }
                                            title='(Shortcut: 2)'
                                            className='border cursor-pointer border-gray-700 hover:border-gray-600 py-auto p-4 rounded bg-gray-800 hover:bg-gray-700 drop-shadow-sm font-bold text-sm text-center opacity-20 text-white'>
                                            <span>{rightTask.title}</span>
                                            <DateTag due={rightTask.due} />
                                            <TimeFrame
                                                timeFrame={rightTask.timeFrame}
                                            />
                                            <Repeat
                                                repeat={rightTask.repeat}
                                                repeatInterval={
                                                    rightTask.repeatInterval
                                                }
                                                repeatUnit={
                                                    rightTask.repeatUnit
                                                }
                                            />
                                            <Strict
                                                strictDeadline={
                                                    rightTask.strictDeadline
                                                }
                                                dueDate={rightTask.due}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
                <Hints keyActions={keyActions} />
            </div>
        </RequireAuth>
    )
}

export default Home
