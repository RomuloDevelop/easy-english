import { Section } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setSections = createAction(
  '[Section] Set Sections',
  props<{ sections: Section[] }>()
)
export const addSection = createAction(
  '[Section] Add Section',
  props<{ section: Section }>()
)
export const updateSection = createAction(
  '[Section] Update Section',
  props<{ section: Section }>()
)
export const deleteSection = createAction(
  '[Section] Delete Section',
  props<{ id: number }>()
)
export const deleteCourseSection = createAction(
  '[Section] Delete Section By Course',
  props<{ courseId: number }>()
)
