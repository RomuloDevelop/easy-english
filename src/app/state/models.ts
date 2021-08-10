export interface AnswerResponse {
  id?: number
  is_valid: 0 | 1
  description: string
  course_quiz_id: number
}

export interface QuizzResponse {
  id?: number
  is_final_quiz: boolean
  question: string
  course_id: number
  title?: string
  lesson_id?: number
  answers?: AnswerResponse[]
}

export interface LessonResponse {
  id: number
  title: string
  description: string
  youtube_id: string
  section_id: number
}

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
  course_id: number
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
  section_id: number
  data: Article | VideoLectue | Quiz
  type: 'Article' | 'Video' | 'Quiz'
  resources?: File[]
}

export interface Section {
  id: number
  course_id: number
  title: string
  subtitle: string
}

export interface Course {
  id?: number
  user_id?: number
  students_count?: number
  title: string
  subtitle: string
  description: string
  status: boolean
  level?: string
  quiz?: FinalQuiz
}

export interface AppState {
  courses: Course[]
  sections: Section[]
  lectures: Lecture[]
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
