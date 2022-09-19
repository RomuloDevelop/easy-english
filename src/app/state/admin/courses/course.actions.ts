import { Course, FinalQuiz } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setCourses = createAction(
  '[Course] Set Courses',
  props<{ courses: Course[] }>()
)

export const addCourse = createAction(
  '[Course] Add Course',
  props<{ course: Course }>()
)
export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ course: Partial<Course> }>()
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
  props<{ id: number; final_quiz: FinalQuiz[] }>()
)
