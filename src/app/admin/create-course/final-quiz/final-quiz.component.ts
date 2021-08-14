import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService } from '../../admin.service'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import { select, Store } from '@ngrx/store'
import { Quiz, FinalQuiz, Answer } from '../../../state/models'
import { updateFinalQuiz } from '../../../state/admin/courses/course.actions'
import { selectCoursesTable } from '../../../state/admin/admin.selectores'
import { QuizzService } from '../../../services/quizz.service'
import memoize from '../../../decorators/memoize'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss']
})
export class FinalQuizComponent implements OnInit {
  loadingQuiz = false
  finalQuiz: FinalQuiz = null
  title: string = ''
  questions: Quiz[] = []
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: Store,
    private quizService: QuizzService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      const { quiz } = courses.find((course) => course.id === this.courseId)
      this.questions =
        quiz == null
          ? []
          : quiz.questions.map((item) => ({
              ...item,
              correctAnswer: item.answers.find((item) => item.correct)?.id,
              answers: [...item.answers.map((item) => ({ ...item }))]
            }))
      this.title = quiz == null ? '' : quiz.title
      this.cdr.markForCheck()
    })
  }

  // addQuestionOrCreateFinalQuiz() {
  //   if (this.questions.length === 0) {
  //     this.addQuestion()
  //   } else {
  //     let detail = this.disabledCreateQuiz()
  //     if (detail !== '') {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail
  //       })
  //       return
  //     }
  //     const quiz = {
  //       title: this.title,
  //       questions: this.questions.map((question) => ({
  //         ...question,
  //         answers: question.answers.map((answer) => ({
  //           ...answer,
  //           correct: question.correctAnswer === answer.id
  //         }))
  //       }))
  //     }
  //     this.store.dispatch(updateFinalQuiz({ id: this.courseId, quiz }))
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'The quiz has been updated'
  //     })
  //   }
  // }

  addQuestion() {
    this.loadingQuiz = true
    const quiz = {
      question: 'Temporal description',
      answers: [],
      correctAnswer: null,
      course_id: this.courseId
    }
    this.quizService
      .addQuizz(quiz, true, true, null, 'Temporal title')
      .subscribe(
        (quiz) => {
          this.loadingQuiz = false
        },
        (err) => {
          console.error(err)
        }
      )
  }

  updateQuiz(quiz: Quiz) {
    this.loadingQuiz = true
    if (quiz.correctAnswer != null) {
      quiz.answers = quiz.answers.map((answer) => {
        return { ...answer, correct: answer.id === quiz.correctAnswer }
      })
    }
    this.quizService.updateQuizz(quiz, true, null).subscribe((quiz) => {
      this.loadingQuiz = false
    })
  }

  addFinalAnswer(questionId) {
    let id = 0
    const question = this.questions.find((item) => item.id === questionId)
    if (question.answers.length)
      id = question.answers[question.answers.length - 1].id + 1
    question.answers.push({
      id,
      text: '',
      correct: false
    })
  }

  deleteaQuestion(id: number) {
    this.questions = this.questions.filter((item) => item.id !== id)
  }

  deleteaAnswer(questionId: number, id: number) {
    for (let question of this.questions) {
      if (question.id === questionId) {
        question.answers = question.answers.filter((item) => item.id !== id)
        break
      }
    }
  }

  @memoize()
  disableAddQuestion(title: string) {
    return title.length <= 0
  }

  @memoize()
  disableAddAnswer(question: string | null) {
    return question == null || question.length <= 0
  }

  disabledCreateQuiz() {
    if (this.title === '') {
      return 'Quiz must have a title'
    }

    let message = ''

    for (let question of this.questions) {
      if (question.question == null || question.question === '') {
        message = "Questions can't be empty"
        break
      }

      let hasCorrectAnswer = false
      let hasText = true
      let answersCount = 0
      for (let answer of question.answers) {
        if (answer.id === question.correctAnswer) {
          hasCorrectAnswer = true
        }
        if (answer.text === '') {
          hasText = false
          break
        }
        answersCount++
      }

      if (!hasText) {
        message = "Answers can't be empty"
        break
      }

      if (!hasCorrectAnswer) {
        message = 'Questions must have a correct answer'
        break
      }

      if (answersCount < 2) {
        message = 'Questions must have more than 1 answer'
        break
      }
    }
    return message
  }
}
