import { AuthState } from '@aws-amplify/ui-components'
import { Auth, Hub } from 'aws-amplify'
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
  newPassword: (user: any, password: string) => Promise<any>
  signIn: (password: string) => Promise<any>
  signOut: () => Promise<any> | undefined

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

    const listener = (data: any) => {
      switch (data?.payload?.event) {
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
        case 'signIn_failure':
          break
        case 'tokenRefresh':
          break
        case 'tokenRefresh_failure':
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
      .then(user => {
        store.dispatch({
          type: 'changeUserGroups',
          payload:
            user?.signInUserSession?.idToken?.payload?.['cognito:groups'],
        })
        return Auth.currentUserInfo()
      })
      .then(data => {
        if (data !== null) {
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
