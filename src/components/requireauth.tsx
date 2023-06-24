import { AuthState } from '@aws-amplify/ui-components'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'wouter'

import Loading from './loading'

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const hasLoadedUser = useSelector(
    (s: { hasLoadedUser?: boolean }) => s?.hasLoadedUser
  )
  const authState = useSelector((s: { authState?: AuthState }) => s?.authState)

  if (!hasLoadedUser)
    return (
      <div className='flex h-screen flex-col justify-center'>
        <Loading />
      </div>
    )
  if (authState === AuthState.SignedIn) return <>{children}</>
  return <Redirect to='/login' />
}

export default RequireAuth
