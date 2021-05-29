import {Lecture, Answer} from '../models'
import {createAction, props} from '@ngrx/store'

export const setLecture = createAction('[Lecture] Set Lecture', props<{lecture: Lecture}>())
export const updateLecture = createAction('[Lecture] Update Lecture', props<{lecture: Lecture}>())
export const deleteLecture = createAction('[Lecture] Delete Lecture', props<{id: number}>())
