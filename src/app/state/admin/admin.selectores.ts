import { createSelector } from '@ngrx/store'
import {
  AppState,
  Course,
  Section,
  Lecture,
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

export const selectLectures = createSelector(
  (state: AppState) => state.lectures,
  (lectures: Array<Lecture>) => lectures
)

export const selectUsers = createSelector(
  (state: AppState) => state.users,
  (users: Array<User>) => users
)

const cbSectionData = (sections: Array<Section>, lectures: Array<Lecture>) => {
  const result = sections.map((section) => ({
    ...section,
    lectures: lectures.filter((lecture) => lecture.section_id === section.id)
  }))
  console.log('result', result)
  return result
}

export const selectSectionsData = createSelector(
  selectSections,
  selectLectures,
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
