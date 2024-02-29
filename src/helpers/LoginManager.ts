import { AuthState } from '@aws-amplify/ui-components'
import { Auth, Hub } from 'aws-amplify'
import { z } from 'zod'
import store from '../store/store'

const EMAIL = 'maxlascombe@gmail.com'

type LoginState =
  | 'signIn'
  | 'signUp'
  | 'signIn_failure'
  | 'tokenRefresh'
  | 'tokenRefresh_failure'
  | 'configured'
  | 'signOut'

class LoginManager {
  formState: 'signIn' | 'signedIn'
  loginState: LoginState
  newPassword: (user: unknown, password: string) => Promise<unknown>
  signIn: (password: string) => Promise<unknown>
  signOut: () => Promise<unknown> | undefined

  constructor() {
    this.formState = 'signIn'
    this.loginState = 'signIn'

    this.signIn = password => Auth.signIn(EMAIL, password)

    this.newPassword = (user, password) => {
      return Auth.completeNewPassword(user, password)
    }

    this.signOut = () => {
      try {
        return Auth.signOut()
      } catch (e) {
        console.error('error signing out: ', e)
      }
    }

    const listener = (data: unknown) => {
      if (
        typeof data !== 'object' ||
        !data ||
        !('payload' in data) ||
        typeof data.payload !== 'object' ||
        !data.payload ||
        !('event' in data.payload) ||
        !data.payload.event
      )
        return
      switch (data.payload.event) {
        case 'signIn':
          this.loadData()
          store.dispatch({
            type: 'changeAuthState',
            payload: AuthState.SignedIn,
          })
          break
        case 'signUp':
          store.dispatch({
            type: 'changeAuthState',
            payload: AuthState.ConfirmSignUp,
          })
          break
        case 'configured':
          this.loadData()
          break
        case 'signOut':
          this.loadData()
          break
        default:
          break
      }
    }

    Hub.listen('auth', listener)
  }

  loadData = () => {
    Auth.currentAuthenticatedUser()
      .then((user: unknown) => {
        const parsedUser = z
          .object({
            signInUserSession: z.object({
              idToken: z.object({
                payload: z.object({ 'cognito:groups': z.array(z.string()) }),
              }),
            }),
          })
          .parse(user)
        store.dispatch({
          type: 'changeUserGroups',
          payload:
            parsedUser.signInUserSession.idToken.payload['cognito:groups'],
        })
        return Auth.currentUserInfo()
      })
      .then((data: unknown) => {
        if (typeof data === 'object' && data !== null) {
          this.formState = 'signedIn'
          store.dispatch({ type: 'changeUser', payload: data })
        } else {
          store.dispatch({ type: 'logout' })
          this.formState = 'signIn'
        }
      })
      .catch(() => {
        store.dispatch({ type: 'logout' })
        this.formState = 'signIn'
      })
  }
}

const loginManager = new LoginManager()
loginManager.loadData()

export default loginManager
