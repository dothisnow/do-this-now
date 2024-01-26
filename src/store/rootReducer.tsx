import { AuthState } from '@aws-amplify/ui-components'

export type State = {
  authState: AuthState
  user: object
  hasLoadedUser: boolean
}

const initialState: State = {
  authState: AuthState.SignedOut,
  user: {},
  hasLoadedUser: false,
}

type Action =
  | {
      type: 'logout'
    }
  | {
      type: 'changeAuthState'
      payload: AuthState
    }
  | {
      type: 'changeState'
      payload: Partial<State>
    }
  | {
      type: 'changeUser'
      payload: object
    }
  | {
      type: 'changeUserGroups'
      payload: unknown
    }

const rootReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'logout':
      return { ...initialState, hasLoadedUser: true }
    case 'changeAuthState':
      return { ...state, authState: action.payload }
    case 'changeState':
      return { ...state, ...action.payload }
    case 'changeUser':
      return {
        ...state,
        user: action.payload,
        authState: AuthState.SignedIn,
        hasLoadedUser: true,
      }
    default:
      return typeof action.payload === 'object' && action.payload
        ? { ...state, ...action.payload }
        : state
  }
}

export default rootReducer
