export type SectionAction = 'update' | 'cancel' | 'delete'

export interface Answer {
    id: number,
    text: string,
    correct: boolean
}
export interface Quiz {
    title: string,
    question: string,
    answers: Answer[]
}

export interface Article {
    title: string,
    detail: string
}

export interface VideoLectue {
    url: string,
    detail: string
}

export interface Lecture {
    id: number,
    sectionId: number,
    data: Quiz | Article | VideoLectue,
    type: 'Article' | 'Video' | 'Quiz'
}

export interface Section {
  id: number,
  courseId: number
  title: string,
  description: string
}

export interface Course {
  id: number
  title: string,
  subtitle: string,
  detail: string,
  status: boolean
}

export interface AppState {
    courses: Course[],
    sections: Section[],
    lectures: Lecture[]
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
