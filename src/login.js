import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'

const Login = () => {
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')

    const authState = useSelector((state) => state.authState)

    const navigate = useNavigate()

    useKeyAction(
        (event) => {
            switch (event.key) {
                case 'Enter':
                    if (showNewPassword) {
                        loginManager
                            .newPassword(user, newPassword)
                            .then((r) => {
                                navigate('/')
                            })
                            .catch((e) => {
                                alert('e')
                                console.log(e)
                            })
                    } else {
                        loginManager
                            .signIn(password)
                            .then((r) => {
                                if (
                                    r.challengeName &&
                                    r.challengeName === 'NEW_PASSWORD_REQUIRED'
                                ) {
                                    setShowNewPassword(true)
                                    setUser(r)
                                    console.log(r)
                                } else {
                                    navigate('/')
                                }
                            })
                            .catch((e) => alert('e' + e))
                    }
                    break
                default:
                    break
            }
        },
        [password, newPassword, showNewPassword, user],
        'keydown'
    )

    if (authState === 'signedIn') return <Navigate to='/' />

    return (
        <div className='h-screen flex flex-col justify-center'>
            <div>
                <label htmlFor='password' className='sr-only'>
                    Password
                </label>
                <input
                    type='password'
                    id='password'
                    placeholder='Password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className='flex-1 block w-96 mw-11/12 mx-auto focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 p-2.5 rounded'
                />
            </div>
            {showNewPassword && (
                <div>
                    <label htmlFor='newpassword'>Password</label>
                    <input
                        type='password'
                        id='newpassword'
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className='flex-1 block w-96 mw-11/12 mx-auto focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 p-2.5 rounded'
                    />
                </div>
            )}
        </div>
    )
}

export default Login
