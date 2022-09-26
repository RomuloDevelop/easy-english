export interface QuizOption {
  id?: number
  is_valid: 0 | 1
  description: string
  quiz_id: number
}

export interface Quiz {
  id?: number
  title: string
  question: string
  options: QuizOption[]
  course_id?: number
  correctAnswer?: number
}

export interface LessonResponse {
  id?: number
  title: string
  description: string
  youtube_id?: string
  section_id: number
  is_quiz: boolean
}

export interface CourseListResponse {
  id: number
  title: string
  subtitle: string
  description: string
  level: string
  status: number
  students_count: number
  user_id: number
  final_quizz_title: string
  sections_count: number
}

export type SectionAction = 'update' | 'cancel' | 'delete'

export interface FinalQuiz {
  id: number
  course_id: number
  quiz_id: number
  required: boolean
  quiz: Quiz
}

export interface Article {
  detail: string
}

export interface VideoLectue {
  url: string
  detail: string
}

export interface Lesson {
  id: number
  title: string
  section_id: number
  data: Article | VideoLectue | Quiz
  is_quiz: boolean
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
  final_quiz?: FinalQuiz[]
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

export interface UserAnswer {
  course_lesson_id: number
  user_id: number
  quiz_option_id: number
  is_valid_option: boolean
}

export interface UserFinalQuizAnswer {
  course_quiz_id: number
  course_quiz: Quiz
  user_id: number
  user: any
  is_valid_option: 0 | 1
  quiz_option_id: number
  quiz_option: QuizOption
}

export interface Enrollment {
  id?: number
  user_id: number
  course_id: number
  last_lesson_id: number
}

export interface Session {
  actualUser: User
  userAnswers: UserAnswer[]
  userFinalQuizAnswers: UserFinalQuizAnswer[]
  enrollment: Enrollment
}

export interface AppState {
  courses: Course[]
  sections: Section[]
  lessons: Lesson[]
  users: User[]
  session: Session
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
