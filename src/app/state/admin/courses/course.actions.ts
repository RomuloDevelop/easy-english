import { Course, FinalQuiz } from '../models'
import { createAction, props } from '@ngrx/store'

export const setCourse = createAction(
  '[Course] Set Course',
  props<{ course: Course }>()
)
export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ course: Course }>()
)
export const deleteCourse = createAction(
  '[Course] Delete Course',
  props<{ id: number }>()
)
export const updateStatus = createAction(
  '[Course] Update Status',
  props<{ id: number; status: boolean }>()
)
export const updateFinalQuiz = createAction(
  '[Course] Update FinalQuiz',
  props<{ id: number; quiz: FinalQuiz }>()
)
