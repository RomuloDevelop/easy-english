import { createSelector } from '@ngrx/store'
import { AppState, User, UserQuiz } from '../models'

export const selectActualUser = createSelector(
  (state: AppState) => state.session.actualUser,
  (actualUser: User) => actualUser
)

export const selectNotes = createSelector(
  (state: AppState) => state.session.userNotes,
  (userNotes: UserQuiz[]) => userNotes
)
