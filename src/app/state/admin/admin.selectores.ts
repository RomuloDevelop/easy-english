import { createSelector } from '@ngrx/store'
import {
  AppState,
  Course,
  Section,
  Lesson,
  ArrayElement,
  User
} from '../models'

export const selectCourses = createSelector(
  (state: AppState) => state.courses,
  (courses: Array<Course>) => courses
)

export const selectSections = createSelector(
  (state: AppState) => state.sections,
  (sections: Array<Section>) => sections
)

export const selectLessons = createSelector(
  (state: AppState) => state.lessons,
  (lessons: Array<Lesson>) => lessons
)

export const selectUsers = createSelector(
  (state: AppState) => state.users,
  (users: Array<User>) => users
)

const cbSectionData = (sections: Array<Section>, lessons: Array<Lesson>) =>
  sections.map((section) => ({
    ...section,
    lessons: lessons.filter((lesson) => lesson.section_id === section.id)
  }))

export const selectSectionsData = createSelector(
  selectSections,
  selectLessons,
  cbSectionData
)

export type SectionData = ArrayElement<ReturnType<typeof cbSectionData>>

const cbCoursesTable = (
  courses: Array<Course>,
  sections: Array<SectionData>
) => {
  return courses.map((course) => ({
    ...course,
    sections: sections.filter((section) => section.course_id === course.id)
  }))
}

export const selectCoursesTable = createSelector(
  selectCourses,
  selectSectionsData,
  cbCoursesTable
)

export type CoursesTableRow = ArrayElement<ReturnType<typeof cbCoursesTable>>
