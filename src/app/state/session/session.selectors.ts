import { createSelector } from '@ngrx/store'
import { AppState, User } from '../models'

export const selectActualUser = createSelector(
  (state: AppState) => state.session.actualUser,
  (actualUser: User) => actualUser
)
