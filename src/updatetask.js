import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/solid'

import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryNewTask } from './hooks/useQueryNewTask'
import useKeyAction from './hooks/useKeyAction'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'

const UpdateTask = () => {
    const { pathname } = useLocation()

    const navigate = useNavigate()

    const taskId = (() => {
        const path = pathname.split('/')
        let lastPathItem = path.pop()
        if (lastPathItem === '') lastPathItem = path.pop()
        if (lastPathItem === 'update-task') navigate(-1)
        return decodeURI(lastPathItem)
    })()

    console.log(taskId)

    const {
        data: { Item: task },
        isLoading: isTaskLoading,
    } = useQueryGetTask(taskId)

    console.log(task)

    const [loading, setLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(true)

    const titleState = useState(taskId)

    const dueMonthState = useState(
        task?.due ? new Date(task.due).getMonth() + 1 : 1
    )
    const dueDayState = useState(
        task?.due ? new Date(task.due).getDate() + 1 : 1
    )
    const dueYearState = useState(
        task?.due ? new Date(task.due).getFullYear() + 1 : 1998
    )

    const strictDeadlineState = useState(false)

    const repeatState = useState('No Repeat')
    const repeatIntervalState = useState(1)
    const repeatUnitState = useState('day')
    const selectedWeekDaysState = useState([
        true,
        true,
        true,
        true,
        true,
        true,
        true,
    ])
    const toggleWeekday = (index) =>
        selectedWeekDaysState[1]([
            ...selectedWeekDaysState[0].slice(0, index),
            !selectedWeekDaysState[0][index],
            ...selectedWeekDaysState[0].slice(index + 1),
        ])

    const timeFrameState = useState(15)

    const { mutate } = useQueryNewTask()

    const submitForm = () => {
        setLoading(true)
        const task = {
            title: titleState[0],
            due: `${dueYearState[0]}-${dueMonthState[0]}-${dueDayState[0]}`,
            strictDeadline: strictDeadlineState[0],
            repeat: repeatState[0],
            repeatInterval: repeatIntervalState[0],
            repeatUnit: repeatUnitState[0],
            repeatWeekdays: selectedWeekDaysState[0],
            timeFrame: timeFrameState[0],
        }
        mutate(task)
    }

    const keyActions = [
        [
            'Enter',
            'Submit form',
            (e) => {
                e.preventDefault()
                e.stopPropagation()
                submitForm()
            },
        ],
        ['Escape', 'Home', () => navigate('/')],
        ['u', 'Toggle Sunday', () => !isTyping && toggleWeekday(0)],
        ['m', 'Toggle Monday', () => !isTyping && toggleWeekday(1)],
        ['t', 'Toggle Tuesday', () => !isTyping && toggleWeekday(2)],
        ['w', 'Toggle Wednesday', () => !isTyping && toggleWeekday(3)],
        ['r', 'Toggle Thursday', () => !isTyping && toggleWeekday(4)],
        ['f', 'Toggle Friday', () => !isTyping && toggleWeekday(5)],
        ['s', 'Toggle Saturday', () => !isTyping && toggleWeekday(6)],
    ]
    useKeyAction(keyActions)

    return (
        <RequireAuth>
            {loading && isTaskLoading ? (
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-90 h-screen flex flex-col justify-center'>
                    <Loading light={false} />
                </div>
            ) : (
                <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
                    <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
                        <div>
                            <div>
                                <h3 className='text-lg leading-6 font-medium '>
                                    <ChevronLeftIcon
                                        className='w-5 h-5 inline-block cursor-pointer'
                                        onClick={() => navigate(-1)}
                                    />
                                    <span>Update Task: {taskId}</span>
                                </h3>
                            </div>
                            <TaskForm
                                {...{
                                    setIsTyping,
                                    titleState,
                                    dueMonthState,
                                    dueDayState,
                                    dueYearState,
                                    strictDeadlineState,
                                    repeatState,
                                    repeatIntervalState,
                                    repeatUnitState,
                                    selectedWeekDaysState,
                                    timeFrameState,
                                    submitForm,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* <Hints keyActions={keyActions} /> */}
        </RequireAuth>
    )
}

export default UpdateTask
