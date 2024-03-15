import { AuthState } from '@aws-amplify/ui-components'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'wouter'
import { Button } from './components/button'
import { Input } from './components/input'
import loginManager from './helpers/LoginManager'
import useKeyAction from './hooks/useKeyAction'
import { State } from './store/rootReducer'

const Login = () => {
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<object>()
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
        .catch((e: Error) => {
          alert('e')
          console.error(e)
        })
    } else {
      loginManager
        .signIn(password)
        .then((r: unknown) => {
          if (
            typeof r === 'object' &&
            r &&
            'challengeName' in r &&
            r.challengeName &&
            r.challengeName === 'NEW_PASSWORD_REQUIRED'
          ) {
            setShowNewPassword(true)
            setUser(r)
          } else {
            navigate('/')
          }
        })
        .catch((e: Error) => alert('e' + e))
    }
  }

  useKeyAction([
    {
      key: 'Enter',
      description: 'Submit login form',
      action: login,
    },
  ])

  if (authState === AuthState.SignedIn) return <Redirect to='/' />

  return (
    <div className='flex h-screen flex-col justify-center'>
      <div>
        <label htmlFor='password' className='sr-only'>
          Password
        </label>
        <Input
          type='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      {showNewPassword && (
        <div>
          <label htmlFor='newpassword'>Password</label>
          <Input
            type='password'
            id='newpassword'
            placeholder='New Password'
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
          />
        </div>
      )}
      <div className='mt-2 flex justify-center'>
        <Button icon={ArrowRightIcon} onClick={login} text='Submit' />
      </div>
    </div>
  )
}

export default Login
