import { User } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setUsers = createAction(
  '[User] Set Users',
  props<{ users: User[] }>()
)
export const addUser = createAction('[User] Add Users', props<{ user: User }>())
export const updateUser = createAction(
  '[User] Update Users',
  props<{ user: User }>()
)
export const deleteUser = createAction(
  '[User] Delete Users',
  props<{ id: number }>()
)
