import { Lecture } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as LectureActions from './lecture.actions'

export type LectureState = ReadonlyArray<Lecture>

export const initialState: LectureState = []

const courseReducers = createReducer(
  initialState,
  on(LectureActions.setLectures, (state, { lectures }) => lectures),
  on(LectureActions.addLecture, (state, { lecture }) => [...state, lecture]),
  on(LectureActions.updateLecture, (state, { lecture }) =>
    state.map((item) => {
      if (item.id === lecture.id) {
        return lecture
      }
      return item
    })
  ),
  on(LectureActions.deleteLecture, (state, { id }) =>
    state.filter((item) => item.id !== id)
  ),
  on(LectureActions.deleteSectionLecture, (state, { sectionId }) =>
    state.filter((item) => item.section_id !== sectionId)
  )
)

export function reducer(state: LectureState | undefined, action: Action) {
  return courseReducers(state, action)
}
