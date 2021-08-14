import {
  Lecture,
  Quiz,
  VideoLectue,
  Article,
  LessonResponse,
  QuizzResponse,
  AnswerResponse,
  Answer,
  FinalQuiz
} from '../state/models'

export class DataTransform {
  static backendToAppData(
    respLessons: LessonResponse,
    respQuizzes: QuizzResponse
  ) {
    let type: 'Article' | 'Video' | 'Quiz' = 'Article'
    if (respLessons.youtube_id != 'null') type = 'Video'
    else if (
      respLessons.youtube_id == 'null' &&
      respLessons.description != 'null'
    )
      type = 'Article'
    else type = 'Quiz'

    const getData = {
      Article: () => ({ detail: respLessons.description }),
      Video: () => ({
        detail: respLessons.description,
        url: respLessons.youtube_id
      }),
      Quiz: () => this.formatQuizzes(respQuizzes)
    }

    const lesson: Lecture = {
      id: respLessons.id,
      title: respLessons.title,
      section_id: respLessons.section_id,
      data: getData[type]() as Article | VideoLectue | Quiz,
      type
    }

    return lesson
  }

  static appDataToBackend(lesson: Lecture) {
    const result: LessonResponse = {
      id: lesson.id,
      title: lesson.title,
      description:
        lesson.type != 'Quiz' ? (lesson.data as Article).detail : 'null',
      youtube_id:
        lesson.type === 'Video' ? (lesson.data as VideoLectue).url : 'null',
      section_id: lesson.section_id
    }
    return result
  }

  static quizzesForPost(
    quiz: Quiz,
    is_final_quizz = false,
    lesson_id?: number,
    title: string = 'Temporal question'
  ) {
    let result: QuizzResponse = {
      title,
      is_final_quizz,
      course_id: quiz.course_id,
      question: quiz.question
    }
    if (!is_final_quizz) result = { ...result, lesson_id }
    return result
  }

  static formatQuizzes(respQuizz: QuizzResponse) {
    let newFormat: Quiz = {
      id: respQuizz.id,
      question: respQuizz.question,
      course_id: respQuizz.course_id,
      answers: []
    }
    if (respQuizz.answers) {
      newFormat = {
        ...newFormat,
        answers: this.formatAnswers(respQuizz.answers),
        correctAnswer: respQuizz.answers.find((answer) => answer.is_valid)?.id
      }
    }
    return newFormat
  }

  static formatFinalQuiz(respFinalQuizz: QuizzResponse[]) {
    const newFormat: FinalQuiz = {
      title: respFinalQuizz[0] ? respFinalQuizz[0].title : '',
      questions: respFinalQuizz.map((item) => this.formatQuizzes(item))
    }
    return newFormat
  }

  static formatAnswers(answers: AnswerResponse[]) {
    return answers.map<Answer>((item) => this.formatAnswer(item))
  }

  static formatAnswer(answer: AnswerResponse) {
    const newFormat: Answer = {
      id: answer.id,
      text: answer.description,
      correct: answer.is_valid === 1 ? true : false
    }
    return newFormat
  }

  static answersToPost(answers: Answer[], course_quiz_id: number) {
    return answers.map<AnswerResponse>((item) =>
      this.answerToPost(item, course_quiz_id)
    )
  }

  static answerToPost(answer: Answer, course_quiz_id: number) {
    const newFormat: AnswerResponse = {
      id: answer.id,
      description: answer.text,
      is_valid: answer.correct ? 1 : 0,
      course_quiz_id
    }
    return newFormat
  }
}
