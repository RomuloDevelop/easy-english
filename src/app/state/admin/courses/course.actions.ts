import {Course} from '../models'
import {createAction, props} from '@ngrx/store'

export const setCourse = createAction('[Course] Set Course', props<{course: Course}>())
export const updateCourse = createAction('[Course] Update Course', props<{course: Course}>())
export const deleteCourse = createAction('[Course] Update Course', props<{id: number}>())
