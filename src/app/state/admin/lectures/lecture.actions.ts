import { Lecture, Quiz } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setLectures = createAction(
  '[Lecture] Set Lectures',
  props<{ lectures: Lecture[] }>()
)

export const addLecture = createAction(
  '[Lecture] Add Lecture',
  props<{ lecture: Lecture }>()
)
export const updateLecture = createAction(
  '[Lecture] Update Lecture',
  props<{ lecture: Lecture }>()
)
export const deleteLecture = createAction(
  '[Lecture] Delete Lecture',
  props<{ id: number }>()
)
export const deleteSectionLecture = createAction(
  '[Lecture] Delete Lecture By Section',
  props<{ sectionId: number }>()
)
export const addQuizz = createAction(
  '[Lecture] Add Quiz',
  props<{ quiz: Quiz }>()
)
export const updateQuiz = createAction(
  '[Quiz] Update Quiz',
  props<{ quiz: Quiz }>()
)
export const deleteQuiz = createAction(
  '[Quiz] Delete Quiz',
  props<{ id: number }>()
)
