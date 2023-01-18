import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { AuthState } from '@aws-amplify/ui-components'

import Loading from './loading'

const RequireAuth = ({ children }: { children: FC }) => {
    const hasLoadedUser = useSelector(
        (s: { hasLoadedUser?: boolean }) => s?.hasLoadedUser
    )
    const authState = useSelector(
        (s: { authState?: AuthState }) => s?.authState
    )

    if (!hasLoadedUser)
        return (
            <div className="h-screen flex flex-col justify-center">
                <Loading />
            </div>
        )
    if (authState === AuthState.SignedIn) return <>{children}</>
    return <Navigate to="/login" />
}

export default RequireAuth
