import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService } from '../../admin.service'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { select, Store } from '@ngrx/store'
import { Question, FinalQuiz, Answer } from '../../../state/admin/models'
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
  questions: Question[] = []
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))

  constructor(
    public adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      this.finalQuiz = courses.find(
        (course) => course.id === this.courseId
      ).quiz
    })
  }

  addQuestionOrCreateFinalQuiz() {
    if (this.questions.length === 0) {
      this.addQuestion()
    } else {
      this.finalQuiz = {
        title: this.title,
        questions: this.questions
      }
      this.store.dispatch(
        updateFinalQuiz({ id: this.courseId, quiz: this.finalQuiz })
      )
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

  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  disabledCreateQuiz(answers: Answer[], id: number) {
    let result = true
    for (let answer of answers) {
      if (answer.id === id) {
        result = false
      }
      if (answer.text === '') {
        result = true
        break
      }
    }
    return result
  }
}
