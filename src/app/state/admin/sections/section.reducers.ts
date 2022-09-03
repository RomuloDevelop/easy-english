import { Section } from '../../models'
import { Action, createReducer, on } from '@ngrx/store'
import * as SectionActions from './section.actions'

export type SectionState = ReadonlyArray<Section>

export const initialState: SectionState = []

const courseReducers = createReducer(
  initialState,
  on(SectionActions.setSections, (state, { sections }) => sections),
  on(SectionActions.addSection, (state, { section }) => [...state, section]),
  on(SectionActions.updateSection, (state, { section }) =>
    state.map((item) => {
      if (item.id === section.id) {
        return section
      }
      return item
    })
  ),
  on(SectionActions.deleteSection, (state, { id }) =>
    state.filter((item) => item.id !== id)
  ),
  on(SectionActions.deleteCourseSection, (state, { courseId }) =>
    state.filter((item) => item.course_id !== courseId)
  )
)

export function reducer(state: SectionState | undefined, action: Action) {
  return courseReducers(state, action)
}
