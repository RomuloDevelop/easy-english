import { Enrollment, User, UserAnswer, UserFinalQuizAnswer } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setActualUser = createAction(
  '[ActualUser] Set User',
  props<{ user: User }>()
)
export const updateActualUser = createAction(
  '[ActualUser] Update User',
  props<{ user: Partial<User> }>()
)

export const addUserAnswer = createAction(
  '[UserAnswers] Add User Answer',
  props<{ userAnswer: UserAnswer }>()
)

export const setUserAnswers = createAction(
  '[UserAnswers] Set User Answers',
  props<{ userAnswers: UserAnswer[] }>()
)

export const updateUserAnswer = createAction(
  '[UserAnswers] Update User Answer',
  props<{ userAnswer: Partial<UserAnswer> }>()
)

export const updateUserAnswers = createAction(
  '[UserAnswers] Update User Answers',
  props<{ userAnswers: UserAnswer[] }>()
)

export const setEnrollment = createAction(
  '[Enrollment] Set User Enrollment',
  props<{ enrollment: Enrollment }>()
)

export const setUserFinalQuizAnswers = createAction(
  '[UserAnswers] Set User Final Quiz Answers',
  props<{ userFinalQuizAnswers: UserFinalQuizAnswer[] }>()
)

export const addUserFinalQuizAnswer = createAction(
  '[UserFinalQuizAnswers] Add User Final Quiz Answers',
  props<{ userFinalQuizAnswer: UserFinalQuizAnswer }>()
)

export const setFinalQuizReminder = createAction(
  '[ShowFinalQuizReminder] Set Final Quiz Reminder',
  props<{ showFinalQuizReminder: boolean }>()
)
