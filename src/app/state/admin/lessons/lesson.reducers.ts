import { Lesson } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as LessonActions from './lesson.actions'

export type LessonState = ReadonlyArray<Lesson>

export const initialState: LessonState = []

const courseReducers = createReducer(
  initialState,
  on(LessonActions.setLessons, (state, { lessons }) => lessons),
  on(LessonActions.addLesson, (state, { lesson }) => [...state, lesson]),
  on(LessonActions.updateLesson, (state, { lesson }) =>
    state.map((item) => {
      if (item.id === lesson.id) {
        return lesson
      }
      return item
    })
  ),
  on(LessonActions.deleteLesson, (state, { id }) =>
    state.filter((item) => item.id !== id)
  ),
  on(LessonActions.deleteSectionLesson, (state, { sectionId }) =>
    state.filter((item) => item.section_id !== sectionId)
  )
)

export function reducer(state: LessonState | undefined, action: Action) {
  return courseReducers(state, action)
}
