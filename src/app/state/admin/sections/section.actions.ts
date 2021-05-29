import {Section} from '../models'
import {createAction, props} from '@ngrx/store'

export const setSection = createAction('[Section] Set Section', props<{section: Section}>())
export const updateSection = createAction('[Section] Update Section', props<{section: Section}>())
export const deleteSection = createAction('[Section] Update Section', props<{id: number}>())
