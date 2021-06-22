export type SectionAction = 'update' | 'cancel' | 'delete'

export interface Answer {
  id: number
  text: string
  correct: boolean
}
export interface Quiz {
  id?: number
  question: string
  answers: Answer[]
  correctAnswer?: number
}

export interface FinalQuiz {
  title: string
  questions: Quiz[]
}

export interface Article {
  detail: string
}

export interface VideoLectue {
  url: string
  detail: string
}

export interface Lecture {
  id: number
  title: string
  sectionId: number
  data: Article | VideoLectue | Quiz
  type: 'Article' | 'Video' | 'Quiz'
  resources?: File[]
}

export interface Section {
  id: number
  courseId: number
  title: string
  description: string
}

export interface Course {
  id: number
  title: string
  subtitle: string
  detail: string
  status: boolean
  quiz?: FinalQuiz
}

export interface AppState {
  courses: Course[]
  sections: Section[]
  lectures: Lecture[]
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
