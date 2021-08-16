import { User } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as UserActions from './user.actions'

export type UserState = ReadonlyArray<User>

export const initialState: UserState = []

const courseReducers = createReducer(
  initialState,
  on(UserActions.setUsers, (state, { users }) => users),
  on(UserActions.addUser, (state, { user }) => [...state, user]),
  on(UserActions.updateUser, (state, { user }) =>
    state.map((item) => {
      if (item.id === user.id) {
        return user
      }
      return item
    })
  ),
  on(UserActions.deleteUser, (state, { id }) =>
    state.filter((item) => item.id !== id)
  )
)

export function reducer(state: UserState | undefined, action: Action) {
  return courseReducers(state, action)
}
