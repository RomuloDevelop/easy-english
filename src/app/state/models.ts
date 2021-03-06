export interface AnswerResponse {
  id?: number
  is_valid: 0 | 1
  description: string
  course_quiz_id: number
}

export interface QuizzResponse {
  id?: number
  is_final_quizz: boolean
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
  id?: number
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
  final_quizz_title?: string
}

export interface User {
  id?: number
  role: number
  name: string
  email: string
  phone: string
  is_supervised: boolean
  dob: string
  role_name?: string
  parent_name?: string
  parent_phone?: string
  parent_phone_two?: string
  parent_email?: string
  description?: string
  password?: string
  is_active?: boolean
}

export interface UserQuiz {
  id?: number
  course_quiz_id: number
  user_id: number
  approved: boolean
  total_ok: number
  total_bad: number
}

export interface Enrollment {
  id?: number
  user_id: number
  course_id: number
  last_lesson_id: number
}

export interface Session {
  actualUser: User
  userNotes: UserQuiz[]
  enrollment: Enrollment
}

export interface AppState {
  courses: Course[]
  sections: Section[]
  lectures: Lecture[]
  users: User[]
  session: Session
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
