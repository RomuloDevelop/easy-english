import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService } from '../../admin.service'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import { select, Store } from '@ngrx/store'
import { Quiz, FinalQuiz, Answer } from '../../../state/admin/models'
import { updateFinalQuiz } from '../../../state/admin/courses/course.actions'
import { selectCoursesTable } from '../../../state/admin/admin.selectores'
import memoize from '../../../decorators/memoize'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss']
})
export class FinalQuizComponent implements OnInit {
  finalQuiz: FinalQuiz = null
  title: string = ''
  questions: Quiz[] = []
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      const { quiz } = courses.find((course) => course.id === this.courseId)
      this.questions = quiz.questions.map((item) => ({
        ...item,
        answers: [...item.answers]
      }))
      this.title = quiz.title
    })
  }

  addQuestionOrCreateFinalQuiz() {
    if (this.questions.length === 0) {
      this.addQuestion()
    } else {
      let detail = this.disabledCreateQuiz()
      if (detail !== '') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail
        })
        return
      }
      const quiz = {
        title: this.title,
        questions: this.questions.map((question) => ({
          ...question,
          answers: question.answers.map((answer) => ({
            ...answer,
            correct: question.correctAnswer === answer.id
          }))
        }))
      }
      this.store.dispatch(updateFinalQuiz({ id: this.courseId, quiz }))
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'The quiz has been updated'
      })
    }
  }

  addQuestion() {
    let id = 0
    if (this.questions.length)
      id = this.questions[this.questions.length - 1].id + 1
    this.questions.push({
      id,
      question: '',
      answers: [],
      correctAnswer: null
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
    console.log(this.questions, questionId, id)
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
