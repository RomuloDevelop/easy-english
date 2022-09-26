import {
  Lesson,
  Quiz,
  VideoLectue,
  Article,
  LessonResponse,
  QuizOption,
  FinalQuiz
} from '../state/models'

export class DataTransform {
  static backendToAppData(respLessons: LessonResponse, respQuizzes: Quiz) {
    let type: 'Article' | 'Video' | 'Quiz' = 'Article'
    const isVideo =
      respLessons.youtube_id != '0' && respLessons.youtube_id != 'null'
    if (isVideo) type = 'Video'
    else if (!respLessons.is_quiz) type = 'Article'
    else type = 'Quiz'

    const getData = {
      Article: () => ({ detail: respLessons.description }),
      Video: () => ({
        detail: respLessons.description,
        url: respLessons.youtube_id
      }),
      Quiz: () => this.formatQuizzes(respQuizzes)
    }

    const lesson: Lesson = {
      id: respLessons.id,
      title: respLessons.title,
      section_id: respLessons.section_id,
      is_quiz: respLessons.is_quiz,
      data: getData[type]() as Article | VideoLectue | Quiz,
      type
    }

    return lesson
  }

  static appDataToBackend(lesson: Lesson) {
    const result: LessonResponse = {
      id: lesson.id,
      title: lesson.title,
      is_quiz: lesson.is_quiz,
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
    lesson_id: number | null,
    title: string = 'Temporal question'
  ) {
    let result = {
      title,
      course_id: quiz.course_id,
      question: quiz.question,
      lesson_id: !quiz.course_id && lesson_id
    }
    return result
  }

  static formatQuizzes(respQuizz: Quiz) {
    let newFormat: Quiz = {
      title: '',
      id: respQuizz.id,
      question: respQuizz.question,
      course_id: respQuizz.course_id,
      options: []
    }
    if (respQuizz.options) {
      newFormat = {
        ...newFormat,
        options: respQuizz.options,
        correctAnswer: respQuizz.options.find((answer) => answer.is_valid)?.id
      }
    }
    return newFormat
  }

  static answersToPost(answers: QuizOption[], course_quiz_id: number) {
    return answers.map<QuizOption>((item) =>
      this.answerToPost(item, course_quiz_id)
    )
  }

  static answerToPost(option: QuizOption, quiz_id: number) {
    const newFormat: QuizOption = {
      ...option,
      quiz_id
    }
    return newFormat
  }
}
