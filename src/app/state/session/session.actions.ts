import { User } from '../models'
import { createAction, props } from '@ngrx/store'

export const setActualUser = createAction(
  '[ActualUser] Set User',
  props<{ user: User }>()
)
export const updateActualUser = createAction(
  '[ActualUser] Update User',
  props<{ user: Partial<User> }>()
)
