import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { defer, iif, Observable, of, zip } from 'rxjs'
import { map, mergeMap, take, tap } from 'rxjs/operators'
import { select, Store } from '@ngrx/store'
import {
  FinalQuiz,
  Quiz,
  Answer,
  QuizzResponse,
  AnswerResponse,
  Lecture
} from '../state/models'
import { selectLectures, selectCourses } from '../state/admin/admin.selectores'
import { updateFinalQuiz } from '../state/admin/courses/course.actions'
import { DataTransform } from '../utils/DataTransform'
import Endpoints from '../../data/endpoints'
import { updateLecture } from '../state/admin/lectures/lecture.actions'

interface FoundedAnswer extends Answer {
  founded?: boolean
}

const { lessonUrl, quizzesUrl, answersUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  constructor(private http: HttpClient, private store: Store) {}

  getQuizzes() {
    return this.http
      .get<{ data: QuizzResponse[] }>(`course_quizzes`)
      .pipe(map(({ data }) => data))
  }

  getQuizzesByLesson(id: number) {
    return this.http
      .get<{ data: QuizzResponse[] }>(`${lessonUrl}/${id}/course_quizzes`)
      .pipe(map(({ data }) => data))
  }

  addQuizz(
    quiz: Quiz,
    save = true,
    is_final_quizz = false,
    lesson_id?: number,
    title?: string
  ) {
    const newFormat = DataTransform.quizzesForPost(
      quiz,
      is_final_quizz,
      lesson_id,
      title
    )
    return this.http.post<{ data: QuizzResponse }>(quizzesUrl, newFormat).pipe(
      map(({ data }) => {
        if (save) {
          let formatedQuiz = DataTransform.formatQuizzes(data)
          if (is_final_quizz)
            this.store
              .pipe(take(1), select(selectCourses))
              .subscribe((courses) => {
                const { quiz, id } = courses.find(
                  (course) => course.id === data.course_id
                )
                const newQuestions = [...quiz.questions, formatedQuiz]
                const newQuiz = { ...quiz, questions: newQuestions }
                this.store.dispatch(updateFinalQuiz({ id, quiz: newQuiz }))
              })
          else
            this.store
              .pipe(take(1), select(selectLectures))
              .subscribe((lessons) => {
                const lecture = lessons.find(
                  (lesson) => lesson.id === data.lesson_id
                )
                lecture.data = formatedQuiz
                this.store.dispatch(updateLecture({ lecture }))
              })
        }
        return data
      })
    )
  }

  updateQuizz(
    quiz: Quiz,
    is_final_quizz = false,
    lesson_id: number,
    title?: string
  ) {
    const newFormat = DataTransform.quizzesForPost(
      quiz,
      is_final_quizz,
      lesson_id,
      title
    )
    return this.http
      .put<{ data: QuizzResponse }>(`${quizzesUrl}/${quiz.id}`, newFormat)
      .pipe(
        // Comparar answers
        mergeMap(({ data }) =>
          iif(
            () => is_final_quizz,
            defer(() =>
              this.store.pipe(
                take(1),
                select(selectCourses),
                mergeMap((courses) => {
                  let course = courses.find(
                    (item) => item.id === quiz.course_id
                  )
                  let finalQuiz = course.quiz
                  let actualQuiz = finalQuiz.questions.find(
                    (item) => item.id === quiz.id
                  )

                  // Agrega, actualiza y elimina donde corresponda
                  const { results, deletes, withoutChange } =
                    this.addOrUpdateAnswer(
                      quiz.answers,
                      (actualQuiz as Quiz).answers,
                      quiz.id
                    )
                  if (!results?.length && !deletes?.length) {
                    return of(data)
                  }
                  return zip(...results, ...deletes).pipe(
                    map((answers) => {
                      const newAnswers = answers.filter(
                        (item: any) => item?.id
                      ) as AnswerResponse[] //Obtiene solo respuestas de insertado y actualizado
                      data.answers = withoutChange
                        .map((item) =>
                          DataTransform.answerToPost(item, quiz.course_id)
                        )
                        .concat(newAnswers)
                      const newQuiz = DataTransform.formatQuizzes(data)
                      const questions = finalQuiz.questions.map((item) => {
                        if (item.id === newQuiz.id) return newQuiz
                        else return item
                      })
                      finalQuiz = { ...finalQuiz, questions: [...questions] }
                      this.store.dispatch(
                        updateFinalQuiz({ quiz: finalQuiz, id: course.id })
                      )
                      return data
                    })
                  )
                })
              )
            ),
            defer(() =>
              this.store.pipe(
                take(1),
                select(selectLectures),
                mergeMap((lessons) => {
                  let actualLesson = lessons.find(
                    (item) => item.id === lesson_id
                  )

                  // Agrega, actualiza y elimina donde corresponda
                  const { results, deletes, withoutChange } =
                    this.addOrUpdateAnswer(
                      quiz.answers,
                      (actualLesson.data as Quiz).answers,
                      quiz.id
                    )
                  console.log(results)
                  console.log(deletes)
                  return zip(...results, ...deletes).pipe(
                    map((answers) => {
                      const newAnswers = answers.filter(
                        (item: any) => item?.id
                      ) as AnswerResponse[] //Obtiene solo respuestas de insertado y actualizado
                      data.answers = withoutChange
                        .map((item) =>
                          DataTransform.answerToPost(item, quiz.course_id)
                        )
                        .concat(newAnswers)
                      const lecture: Lecture = {
                        id: actualLesson.id,
                        title: actualLesson.title,
                        section_id: actualLesson.section_id,
                        type: actualLesson.type,
                        resources: actualLesson.resources,
                        data: DataTransform.formatQuizzes(data)
                      }
                      this.store.dispatch(updateLecture({ lecture }))
                      return data
                    })
                  )
                })
              )
            )
          )
        )
      )
  }

  // Solo para examen final
  deleteQuiz(quiz: Quiz) {
    return this.http.delete(`${quizzesUrl}/${quiz.id}`).pipe(
      mergeMap(() =>
        this.store.pipe(
          take(1),
          select(selectCourses),
          map((courses) => {
            const course = courses.find((item) => item.id === quiz.course_id)
            const quizFiltered = course.quiz.questions.filter(
              (item) => item.id !== quiz.id
            )
            this.store.dispatch(
              updateFinalQuiz({
                id: course.id,
                quiz: { questions: quizFiltered }
              })
            )
          })
        )
      )
    )
  }

  getAnswers() {
    return this.http
      .get<{ data: AnswerResponse[] }>(answersUrl)
      .pipe(map(({ data }) => data))
  }

  addAnswer(answer: Answer, quiz_id: number) {
    const newFormat = DataTransform.answerToPost(answer, quiz_id)
    return this.http
      .post<{ data: AnswerResponse }>(answersUrl, newFormat)
      .pipe(map(({ data }) => data))
  }

  updateAnswer(answer: Answer, quiz_id: number) {
    const newFormat = DataTransform.answerToPost(answer, quiz_id)
    return this.http
      .put<{ data: AnswerResponse }>(`${answersUrl}/${answer.id}`, newFormat)
      .pipe(map(({ data }) => data))
  }

  deleteAnswer(answer: Answer) {
    return this.http.delete(`${answersUrl}/${answer.id}`)
  }

  addOrUpdateAnswer(newList: Answer[], answers: Answer[], quiz_id: number) {
    const withoutChange: Answer[] = []
    let results: Observable<AnswerResponse>[] = []
    let deletes: Observable<Object>[] = []

    console.log(newList, answers)

    let forUpdates: Answer[] = []
    const forDelete = []
    answers.forEach((answer) => {
      //Search for updates
      const foundedAnswer = newList.find(
        (actualAnswer) => actualAnswer.id === answer.id
      )
      const newAnswer = foundedAnswer != null ? { ...foundedAnswer } : null
      if (newAnswer?.id === answer.id) {
        if (
          newAnswer.correct !== answer.correct ||
          newAnswer.text !== answer.text
        ) {
          forUpdates.push(newAnswer)
        } else {
          withoutChange.push(newAnswer)
        }
      } else {
        //Search for deletes
        forDelete.push(answer)
      }
    })

    deletes = forDelete.map((item) => this.deleteAnswer(item))

    let inserts = []
    //Search for inserts
    if (answers.length <= 0) {
      inserts = newList.map((answer) =>
        this.addAnswer(
          {
            text: answer.text,
            correct: answer.correct
          },
          quiz_id
        )
      )
    } else {
      const founded = withoutChange.concat(forUpdates)
      newList.forEach((answer) => {
        if (
          founded.find((item) => item.id === answer.id) == null &&
          forDelete.find((item) => item.id === answer.id) == null
        ) {
          inserts.push(
            this.addAnswer(
              {
                text: answer.text,
                correct: answer.correct
              },
              quiz_id
            )
          )
        }
      })
    }

    results = forUpdates
      .map((item) => this.updateAnswer(item, quiz_id))
      .concat(inserts)
    return { results, deletes, withoutChange }
  }
}
