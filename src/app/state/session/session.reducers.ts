import { Session } from '../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as UserActions from './session.actions'

export const initialState: Session = {
  actualUser: null
}

const actualUserReducer = createReducer(
  initialState,
  on(UserActions.setActualUser, (state, { user }) => ({
    ...state,
    actualUser: user
  })),
  on(UserActions.updateActualUser, (state, { user }) => ({
    ...state,
    actualUser: {
      ...state.actualUser,
      ...user
    }
  }))
)

export function reducer(state: Session | undefined, action: Action) {
  return actualUserReducer(state, action)
}
