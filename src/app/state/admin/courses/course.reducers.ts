import { Course } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as CourseActions from './course.actions'

export type CourseState = ReadonlyArray<Course>

export const initialState: CourseState = []

const courseReducers = createReducer(
  initialState,
  on(CourseActions.setCourses, (state, { courses }) => courses),
  on(CourseActions.addCourse, (state, { course }) => [...state, course]),
  on(CourseActions.updateCourse, (state, { course }) =>
    state.map((item) => {
      if (item.id === course.id) {
        return { ...item, ...course }
      }
      return item
    })
  ),
  on(CourseActions.deleteCourse, (state, { id }) =>
    state.filter((item) => item.id !== id)
  ),
  on(CourseActions.updateStatus, (state, { id, status }) =>
    state.map((item) => {
      if (item.id === id) {
        return { ...item, status }
      }
      return item
    })
  ),
  on(CourseActions.updateFinalQuiz, (state, { id, final_quiz }) =>
    state.map((item) => {
      if (item.id === id) {
        return { ...item, final_quiz }
      }
      return item
    })
  )
)

export function reducer(state: CourseState | undefined, action: Action) {
  return courseReducers(state, action)
}
