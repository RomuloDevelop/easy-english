import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, zip } from 'rxjs'
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
import { updateCourse } from '../state/admin/courses/course.actions'
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

  addFinalQuiz(finalQuiz: FinalQuiz, course_id: number) {
    const requests = finalQuiz.questions.map((question) =>
      this.addQuizz(question, true, true, null, finalQuiz.title)
    )
    return zip(requests)
  }

  addQuizz(
    quiz: Quiz,
    save = true,
    is_final_quiz = false,
    lesson_id?: number,
    title?: string
  ) {
    const newFormat = DataTransform.quizzesForPost(
      quiz,
      is_final_quiz,
      lesson_id,
      title
    )
    return this.http.post<{ data: QuizzResponse }>(quizzesUrl, newFormat).pipe(
      map(({ data }) => {
        if (save) {
          let formatedQuiz = DataTransform.formatQuizzes(data)
          if (is_final_quiz)
            this.store
              .pipe(take(1), select(selectCourses))
              .subscribe((courses) => {
                const course = courses.find(
                  (course) => course.id === data.course_id
                )
                course.quiz.questions.push(formatedQuiz)
                this.store.dispatch(updateCourse({ course }))
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
    is_final_quiz = false,
    lesson_id: number,
    title?: string
  ) {
    const newFormat = DataTransform.quizzesForPost(
      quiz,
      is_final_quiz,
      lesson_id,
      title
    )
    return this.http
      .put<{ data: QuizzResponse }>(`${quizzesUrl}/${quiz.id}`, newFormat)
      .pipe(
        // Comparar answers
        mergeMap(({ data }) =>
          this.store.pipe(
            select(selectLectures),
            mergeMap((lessons) => {
              let actualLesson = lessons.find((item) => item.id === lesson_id)

              // Agrega, actualiza y elimina donde corresponda
              const { result, deletes } = this.addOrUpdateAnswer(
                quiz.answers,
                (actualLesson.data as Quiz).answers,
                quiz.id
              )
              let deleteRequest = deletes.length ? zip(...deletes) : of([])
              console.log(result)
              return zip(zip(...result), deleteRequest).pipe(
                map(([answers]) => {
                  data.answers = answers
                  return data
                }),
                tap((data) => {
                  const lecture: Lecture = {
                    id: actualLesson.id,
                    title: actualLesson.title,
                    section_id: actualLesson.section_id,
                    type: actualLesson.type,
                    resources: actualLesson.resources,
                    data: DataTransform.formatQuizzes(data)
                  }
                  this.store.dispatch(updateLecture({ lecture }))
                })
              )
            }),
            take(1)
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

  addOrUpdateAnswer(
    newList: FoundedAnswer[],
    answers: Answer[],
    quiz_id: number
  ) {
    console.log(newList, answers)
    let result: Observable<AnswerResponse>[] = []
    let deletes: Observable<Object>[] = []

    answers.forEach((answer) => {
      //Search for updates
      const newAnswer = newList.find(
        (actualAnswer) => actualAnswer.id === answer.id
      )
      if (newAnswer.id === answer.id) {
        newAnswer.founded = true
        if (
          newAnswer.correct !== answer.correct ||
          newAnswer.text !== answer.text
        ) {
          result.push(this.updateAnswer(newAnswer, quiz_id))
        }
      } else {
        //Search for deletes
        deletes.push(this.deleteAnswer(answer))
      }
    })

    //Search for inserts
    result = result.concat(
      newList
        .filter((newAnswer) => !newAnswer.founded)
        .map((newAnswer) => {
          delete newAnswer.founded
          delete newAnswer.id
          return this.addAnswer(newAnswer, quiz_id)
        })
    )
    return { result, deletes }
  }
}
