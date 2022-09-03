import { Enrollment, User, UserQuiz } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setActualUser = createAction(
  '[ActualUser] Set User',
  props<{ user: User }>()
)
export const updateActualUser = createAction(
  '[ActualUser] Update User',
  props<{ user: Partial<User> }>()
)

export const addUserNote = createAction(
  '[UserNotes] Add User Notes',
  props<{ userNote: UserQuiz }>()
)
export const setUserNotes = createAction(
  '[UserNotes] Set User Notes',
  props<{ userNotes: UserQuiz[] }>()
)
export const updateUserNote = createAction(
  '[UserNotes] Update User Note',
  props<{ userNote: Partial<UserQuiz> }>()
)

export const updateUserNotes = createAction(
  '[UserNotes] Update User Notes',
  props<{ userNotes: UserQuiz[] }>()
)

export const setEnrollment = createAction(
  '[Enrollment] Set User Enrollment',
  props<{ enrollment: Enrollment }>()
)
