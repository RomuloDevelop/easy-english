export type SectionAction = 'update' | 'cancel' | 'delete'

export interface Answer {
    id: number,
    text: string,
    correct: boolean
}
export interface Quiz {
    id?: number,
    title: string,
    question: string,
    answers: Answer[],
    correctAnswer?: number
}

export type Question = Omit<Quiz, 'title'>

export interface FinalQuiz {
    title: string,
    questions: Question[]
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
    data: Quiz | Article | VideoLectue | FinalQuiz,
    type: 'Article' | 'Video' | 'Quiz' | 'FinalQuiz'
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
