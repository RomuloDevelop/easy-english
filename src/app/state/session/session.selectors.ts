import { createSelector } from '@ngrx/store'
import { AppState, Enrollment, User, UserQuiz } from '../models'

export const selectActualUser = createSelector(
  (state: AppState) => state.session.actualUser,
  (actualUser: User) => actualUser
)

export const selectNotes = createSelector(
  (state: AppState) => state.session.userNotes,
  (userNotes: UserQuiz[]) => userNotes
)

export const selectUserEnrollment = createSelector(
  (state: AppState) => state.session.enrollment,
  (enrollment: Enrollment) => enrollment
)
