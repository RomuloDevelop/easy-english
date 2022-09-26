import { createSelector } from '@ngrx/store'
import {
  AppState,
  Enrollment,
  User,
  UserAnswer,
  UserFinalQuizAnswer
} from '../models'

export const selectActualUser = createSelector(
  (state: AppState) => state.session.actualUser,
  (actualUser: User) => actualUser
)

export const selectUserAnswers = createSelector(
  (state: AppState) => state.session.userAnswers,
  (userAnswers: UserAnswer[]) => userAnswers
)

export const selectUserFinalQuizAnswers = createSelector(
  (state: AppState) => state.session.userFinalQuizAnswers,
  (userFinalQuizAnswers: UserFinalQuizAnswer[]) => userFinalQuizAnswers
)

export const selectUserEnrollment = createSelector(
  (state: AppState) => state.session.enrollment,
  (enrollment: Enrollment) => enrollment
)
