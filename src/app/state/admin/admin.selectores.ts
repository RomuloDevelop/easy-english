import { createSelector } from "@ngrx/store";
import { AppState, Course, Section, Lecture } from "./models";

export const selectCourses = createSelector(
    (state: AppState) => state.courses,
    (courses: Array<Course>) => courses
);

export const selectSections = createSelector(
    (state: AppState) => state.sections,
    (sections: Array<Section>) => sections
);

export const selectLectures = createSelector(
    (state: AppState) => state.lectures,
    (lectures: Array<Lecture>) => lectures
);

export const selectCoursesTable = createSelector(
  selectCourses,
  selectSections,
  selectLectures,
  (courses: Array<Course>, sections: Array<Section>) => {
    return courses.map(course => ({
        ...course,
        sections: sections.filter((section) => section.courseId === course.id)
    }))
  }
);

export const selectSectionsData = createSelector(
  selectSections,
  selectLectures,
  (sections: Array<Section>, lectures: Array<Lecture>) => {
    return sections.map(section => ({
        ...section,
        lectures: lectures.filter((lecture) => lecture.sectionId === section.id)
    }))
  }
);
