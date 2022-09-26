import { Lesson, Quiz } from '../../models'
import { createAction, props } from '@ngrx/store'

export const setLessons = createAction(
  '[Lesson] Set Lessons',
  props<{ lessons: Lesson[] }>()
)

export const addLesson = createAction(
  '[Lesson] Add Lesson',
  props<{ lesson: Lesson }>()
)
export const updateLesson = createAction(
  '[Lesson] Update Lesson',
  props<{ lesson: Lesson }>()
)
export const deleteLesson = createAction(
  '[Lesson] Delete Lesson',
  props<{ id: number }>()
)
export const deleteSectionLesson = createAction(
  '[Lesson] Delete Lesson By Section',
  props<{ sectionId: number }>()
)
export const addQuizz = createAction(
  '[Lesson] Add Quiz',
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
