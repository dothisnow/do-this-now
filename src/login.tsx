import { AuthState } from '@aws-amplify/ui-components'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'wouter'

import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'

import { State } from './store/rootReducer'

const Login = () => {
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const authState = useSelector((state: State) => state.authState)

  const navigate = useLocation()[1]

  const login = () => {
    if (showNewPassword) {
      loginManager
        .newPassword(user, newPassword)
        .then(() => {
          navigate('/')
        })
        .catch(e => {
          alert('e')
          console.error(e)
        })
    } else {
      loginManager
        .signIn(password)
        .then(r => {
          if (r.challengeName && r.challengeName === 'NEW_PASSWORD_REQUIRED') {
            setShowNewPassword(true)
            setUser(r)
          } else {
            navigate('/')
          }
        })
        .catch(e => alert('e' + e))
    }
  }

  useKeyAction([['Enter', 'Submit login form', login]])

  if (authState === AuthState.SignedIn) return <Redirect to='/' />

  return (
    <div className='flex h-screen flex-col justify-center'>
      <div>
        <label htmlFor='password' className='sr-only'>
          Password
        </label>
        <input
          type='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={event => setPassword(event.target.value)}
          className='mw-11/12 mx-auto block w-96 min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
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
            onChange={event => setNewPassword(event.target.value)}
            className='mw-11/12 mx-auto block w-96 min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
          />
        </div>
      )}
      <div className='mt-2 flex justify-center'>
        <button
          onClick={login}
          className='inline-block rounded-full border border-gray-700 bg-gray-800 py-2 px-2.5 text-sm text-white hover:border-gray-600 hover:bg-gray-700'>
          Submit
        </button>
      </div>
    </div>
  )
}

export default Login
