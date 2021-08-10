import { Quiz } from '../../models'
import { createAction, props } from '@ngrx/store'

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
