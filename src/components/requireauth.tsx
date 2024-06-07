import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'wouter'
import { currentAuthenticatedUser } from '../helpers/login-helper'
import { Loading } from './loading'

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const hasLoadedUser = useSelector(
    (s: { hasLoadedUser?: boolean }) => s?.hasLoadedUser
  )
  const authState = useSelector((s: { authState?: string }) => s?.authState)
  console.log({ hasLoadedUser })
  if (!hasLoadedUser) {
    currentAuthenticatedUser()
    return (
      <div className='flex h-screen flex-col justify-center'>
        <Loading />
      </div>
    )
  }
  if (authState === 'authenticated') return <>{children}</>
  return <Redirect to='/login' />
}

export default RequireAuth
