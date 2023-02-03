import { AuthState } from '@aws-amplify/ui-components'

const initialState = {
    authState: AuthState.SignedOut,
    user: {},
    hasLoadedUser: false,
}

type Action = {
    type: string
    payload?: any
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
            return { ...state, ...action.payload }
    }
}

export default rootReducer
